<script setup lang="tsx">
  import { useRouter } from 'vue-router';
  import { $t, language } from '@/locales';
  import { TaskDataMonitorApi } from '@/service/api/task';
  import { useAppStore } from '@/store/modules/app';
  import TaskSearch from './modules/task-search.vue';
  import { useTable, useTableOperate } from '@/hooks/common/table';
  import { runModeRecord, taskStatusRecord } from '@/constants/options';

  const router = useRouter();
  const appStore = useAppStore();

  const { columns, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
    apiFn: TaskDataMonitorApi.fetchGetList,
    apiParams: {
      current: 1,
      size: 10,
      taskName: undefined,
      description: undefined,
      id: undefined,
      status: undefined
    },
    columns: () => [
      {
        key: 'id',
        dataIndex: 'id',
        title: $t('page.task.id'),
        width: 88,
        align: 'center'
      },
      {
        key: 'taskName',
        dataIndex: 'taskName',
        title: $t('page.task.taskName'),
        align: 'center',
        minWidth: 120
      },
      {
        key: 'runMode',
        dataIndex: 'runMode',
        title: $t('page.task.runMode'),
        minWidth: 120,
        customRender: ({ record } )=> {
          if (record.runMode === null) {
            return null;
          }
          const label = $t(runModeRecord[record.runMode]);
          return label;
        }
      },
      {
        key: 'runFrequency',
        dataIndex: 'runFrequency',
        title: $t('page.task.runFrequency'),
        align: 'center',
        minWidth: 120
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: $t('page.task.status'),
        align: 'center',
        minWidth: 120,
        customRender: ({ record })=> {
          if (record.status === null) {
            return null;
          }
          const label = $t(taskStatusRecord[record.status]);
          return label;
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 130,
        customRender:  ({ record })=> (
          <div class="flex-center gap-8px">
            <a-button type="default" class={`orange-btn row-btn ${language() === 'en-US' ? 'en-edit' : ''}`} onClick={() => handleEdit(record.id)}>
              <icon-mdi-square-edit-outline class="align-sub text-16px" />
              <span>{$t('common.edit')}</span>
            </a-button>
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

  const { onDeleted } = useTableOperate(data, getData);

  async function handleAdd() {
    appStore.tabStore.removeActiveTab();
    router.push({ name: 'monitor_action' });
  }

  async function handleDelete(id: number) {
    const { error, response } = await TaskDataMonitorApi.fetchDelete(id);
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

  function handleEdit(id: number) {
    appStore.tabStore.removeActiveTab();
    router.push({ name: 'monitor_action', query: { id: String(id) } });
  }

  function refresh() {
    getData();
  }
</script>
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TaskSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.monitor.title')" :bordered="false" class="card-wrapper sm:flex-1-hidden">
      <template #extra>
          <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
          <slot name="prefix"></slot>
          <slot name="default">
            <a-button type="primary" ghost @click="handleAdd">
              <template #icon>
                <icon-ic-round-plus class="align-sub text-icon" />
              </template>
              <span class="ml-5px">{{ $t('common.add') }}</span>
            </a-button>
          </slot>
          <a-button type="primary" ghost @click="refresh">
            <template #icon>
              <icon-mdi-refresh class="align-sub text-icon" :class="{ 'animate-spin': loading }" />
            </template>
            <span class="ml-0px">{{ $t('common.refresh') }}</span>
          </a-button>
        </div>
      </template>
      <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" size="small" :loading="loading" row-key="id" :pagination="mobilePagination" bordered />
    </a-card>
  </div>
</template>

<style scoped></style>

