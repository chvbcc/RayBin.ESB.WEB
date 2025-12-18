<script setup lang="tsx">
import dayjs from 'dayjs';
import { $t } from '@/locales';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import TaskLogSearch from './modules/tasklog-search.vue';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchGetPagingList, fetchDelete } from '@/service/api/log';
import { taskTypeRecord, logLevelRecord } from '@/constants/options';

const router = useRouter();

const { columns, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchGetPagingList,
  apiParams: {
    current: 1,
    size: 10,
    taskID: undefined,
    taskName: undefined,
    taskType: undefined,
    logLevel: undefined,
  },
  columns: () => [
    {
      key: 'taskID',
      dataIndex: 'taskID',
      title: $t('page.taskLog.taskID'),
      width: 120,
      align: 'center'
    },
    {
      key: 'taskName',
      dataIndex: 'taskName',
      title: $t('page.taskLog.taskName'),
      align: 'center',
      minWidth: 120,
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
      width: 130,
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
      width: 130,
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
      width: 130,
      customRender: ({ record }) => {
        return `${record.spentTime} ms`;
      }
    },
    {
      key: 'message',
      dataIndex: 'message',
      title: $t('page.taskLog.message'),
      align: 'center',
      minWidth: 180
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: $t('page.taskLog.createTime'),
      align: 'center',
      width: 150,
      customRender: ({ record }) => {
        return record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD') : '';
      }
    }
  ]
});


const { checkedRowKeys, rowSelection, onDeleted } = useTableOperate(data, getData);
const disableDelete = computed(() => !checkedRowKeys.value.length || loading.value);

async function handleDelete() {
  if (disableDelete.value) return;
  const ids = [...checkedRowKeys.value];
  const { error } = await fetchDelete(ids);
  if (!error) {
    onDeleted();
    window.$message?.success($t('common.deleteSuccess'));
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
          <slot name="prefix"></slot>
          <slot name="default">
            <a-popconfirm :title="$t('common.confirmDelete')" :disabled="disableDelete" @confirm="handleDelete">
              <a-button type="primary" ghost :disabled="disableDelete">
                <template #icon>
                  <icon-ic-round-plus class="align-sub text-icon" />
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
