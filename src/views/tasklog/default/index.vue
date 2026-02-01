<script setup lang="tsx">
  import dayjs from 'dayjs';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { $t, language } from '@/locales';
  import TaskLogSearch from './modules/tasklog-search.vue';
  import { useTable, useTableOperate } from '@/hooks/common/table';
  import { fetchGetPagingList, fetchDeletes } from '@/service/api/log';
  import { taskTypeRecord, logLevelRecord } from '@/constants/options';

  const router = useRouter();

  const { columns, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
    apiFn: fetchGetPagingList,
    apiParams: {
      current: 1,
      size: 10,
      taskName: undefined,
      taskType: undefined,
      logLevel: undefined,
    },
    columns: () => [
      {
        key: 'taskID',
        dataIndex: 'taskID',
        title: $t('page.taskLog.taskID'),
        width: 90,
        align: 'center'
      },
      {
        key: 'taskName',
        dataIndex: 'taskName',
        title: $t('page.taskLog.taskName'),
        align: 'center',
        minWidth: 120,
        ellipsis: true,
        customRender: ({ record }) => {
          return (
            <a-button type="link" onClick={() => router.push(`/tasklog/details/${record.id}`)}>
              <span style="font-size:14px">{record.taskName}</span>
            </a-button>
          );
        }
      },
      {
        key: 'taskType',
        dataIndex: 'taskType',
        title: $t('page.taskLog.taskType'),
        align: 'center',
        width: 110,
        customRender: ({ record }) => {
          if (record.taskType === null) {
            return null;
          }
          const label = $t(taskTypeRecord[record.taskType]);
          return label;
        }
      },
      {
        key: 'logLevel',
        dataIndex: 'logLevel',
        title: $t('page.taskLog.logLevel'),
        align: 'center',
        width: 90,
        customRender: ({ record }) => {
          if (record.logLevel === null) {
            return null;
          }
          const label = $t(logLevelRecord[record.logLevel]);
          return <a-tag color={`${getColor(record.logLevel)}`}>{label}</a-tag>;
        }
      },
      {
        key: 'spentTime',
        dataIndex: 'spentTime',
        title: $t('page.taskLog.spentTime'),
        align: 'center',
        width:  language()==='en-US'? 130: 90,
        customRender: ({ record }) => {
          return `${record.spentTime} ms`;
        }
      },
      {
        key: 'message',
        dataIndex: 'message',
        title: $t('page.taskLog.message'),
        align: 'left',
        minWidth: 180,
        ellipsis: true
      },
      {
        key: 'createTime',
        dataIndex: 'createTime',
        title: $t('page.taskLog.createTime'),
        align: 'center',
        width: 150,
        customRender: ({ record }) => {
          return record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '';
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 100,
        customRender:  ({ record })=> (
          <div class="flex-center gap-8px">
            <a-popconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(record.id)}>
              <a-button type="default" class="red-btn row-btn">
                <icon-mdi-trash-can-outline class="align-sub text-16px" />
                <span>{$t('common.delete')}</span>
              </a-button>
            </a-popconfirm>
          </div>
        )
      }
    ]
  });

  const { checkedRowKeys, rowSelection, onDeleted } = useTableOperate(data, getData);
  const disableDelete = computed(() => !checkedRowKeys.value.length || loading.value);

  async function handleDeletes() {
    if (disableDelete.value) return;
    const ids = [...checkedRowKeys.value];
    const { error } = await fetchDeletes(ids);
    if (!error) {
      onDeleted();
      window.$message?.success($t('common.deleteSuccess'));
    } else {
      window.$message?.error($t('common.deleteFailed'));
    }
  }

  async function handleDelete(id: number) {
    const ids = [id];
    const { error, response } = await fetchDeletes(ids);
    if (error) { window.$message?.error($t('common.deleteFailed')); return; }
    const result = response.data as { code: string; msg: string; data: string };
    if (result.msg === "success") {
      onDeleted();
    } else if (result.msg === "fail") {
      window.$message?.error(result.data);
    } else {
      window.$message?.error($t('common.deleteFailed'));
    }
  }

  function getColor(level: number) {
    switch (level) {
      case 1:
        return '#07af61';
      case 2:
        return '#f39c12';
      case 3:
        return '#f66060';
      case 4:
        return '#531dab';
      default:
        return '#2db7f5';
    }
  }

  function refresh() {
    getData();
  }
</script>
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TaskLogSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.taskLog.title')" :bordered="false" class="card-wrapper sm:flex-1-hidden">
      <template #extra>
        <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
          <slot name="default">
            <a-popconfirm :title="$t('common.confirmDelete')" :disabled="disableDelete" @confirm="handleDeletes">
              <a-button type="primary" ghost :disabled="disableDelete">
                <template #icon>
                  <icon-mdi-trash-can-outline class="align-sub text-icon" />
                </template>
                <span class="ml-5px">{{ $t('common.delete') }}</span>
              </a-button>
            </a-popconfirm>
          </slot>
          <a-button type="primary" ghost @click="refresh">
            <template #icon>
              <icon-mdi-refresh class="align-sub text-icon" :class="{ 'animate-spin': loading }" />
            </template>
            <span class="ml-0px">{{ $t('common.refresh') }}</span>
          </a-button>
        </div>
      </template>
      <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" :row-selection="rowSelection" size="small" :loading="loading" row-key="id" :pagination="mobilePagination" bordered />
    </a-card>
  </div>
</template>

<style scoped></style>
