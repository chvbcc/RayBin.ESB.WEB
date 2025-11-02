<script setup lang="tsx">
import { $t } from '@/locales';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
import { fetchGetPagingList, fetchDelete } from '@/service/api/task';
import { dataHandleRecord, runModeRecord, taskStatusRecord } from '@/constants/task';
import TaskSearch from '@/components/pages/task-search.vue';
import { useTable, useTableOperate } from '@/hooks/common/table';

const router = useRouter();
const appStore = useAppStore();

const { columns, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchGetPagingList,
  apiParams: {
    current: 1,
    size: 10,
    taskName: undefined,
    description: undefined,
    runMode: undefined,
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
      key: 'dataHandle',
      dataIndex: 'dataHandle',
      title: $t('page.task.dataHandle'),
      align: 'center',
      minWidth: 88,
      customRender: ({ record } )=> {
        if (record.dataHandle === null) {
          return null;
        }
        const label = $t(dataHandleRecord[record.dataHandle]);
        return label;
      }

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
      key: 'runTime',
      dataIndex: 'runTime',
      title: $t('page.task.runTime'),
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
          <a-button type="default" class="table-edit-btn" onClick={() => handleEdit(record.id)}>
            {$t('common.edit')}
          </a-button>
          <a-popconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(record.id)}>
            <a-button type="default" class="table-delete-btn">
              {$t('common.delete')}
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
  router.push({ name: 'database-action' });
}

function handleDelete(id: number) {
  fetchDelete(id).then((res) => {
    if(!res.error) {
      const result = res.response.data;
      if (result.msg === 'success' && result.data === true) {
        onDeleted();
      }
      else if (result.msg === 'fail') {
        window.$message?.error(String(result.data));
      }
      else if (res.response.status != 200) {
        window.$message?.error($t('common.deleteFailed'));
      }
    }
  })
}

function handleEdit(id: number) {
  appStore.tabStore.removeActiveTab();
  router.push({ name: 'database-action', query: { id: String(id) } });
}

function refresh() {
  getData();
}
</script>
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TaskSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.database.title')" :bordered="false" class="card-wrapper sm:flex-1-hidden">
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

