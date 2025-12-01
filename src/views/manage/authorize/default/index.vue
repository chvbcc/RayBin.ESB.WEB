<script setup lang="tsx">
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { Button } from 'ant-design-vue';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { AuthorizeApi } from '@/service/api/manage';
import { useTable, useTableOperate, useTableScroll } from '@/hooks/common/table';
import AuthorizeSearch from './modules/authorize-search.vue';

const router = useRouter();
const appStore = useAppStore();
const { tableWrapperRef, scrollConfig } = useTableScroll();

const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: AuthorizeApi.fetchGetPagingList,
  apiParams: {
    current: 1,
    size: 10,
    name: undefined,
    method: undefined,
    requestUrl: undefined
  },
  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      dataIndex: 'index',
      align: 'center',
      width: 64
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: $t('page.authorize.name'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'method',
      dataIndex: 'method',
      title: $t('page.authorize.method'),
      align: 'center',
      width: 130
    },
    {
      key: 'requestUrl',
      dataIndex: 'requestUrl',
      title: $t('page.authorize.requestUrl'),
      align: 'center',
      minWidth: 180
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: $t('page.authorize.createTime'),
      align: 'center',
      width: 150,
      customRender: ({ record }) => {
        return record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD') : '';
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      customRender: ({ record }) => (
        <div class="flex-center justify-end gap-8px">
          <Button type="primary" ghost size="small" onClick={() => edit(record.id)}>
            {$t('common.edit')}
          </Button>
          <a-popconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(record.id)}>
            <Button danger size="small">
              {$t('common.delete')}
            </Button>
          </a-popconfirm>
        </div>
      )
    }
  ]
});

const { handleEdit, checkedRowKeys, rowSelection, onBatchDeleted, onDeleted } = useTableOperate(data, getData);

async function handleBatchDelete() {
  if (checkedRowKeys.value.length === 0) return;
  const { error, response } = await AuthorizeApi.fetchDeletes(checkedRowKeys.value);
  if (error) {
    window.$message?.error($t('common.deleteFailed'));
    return;
  }
  const result = response.data as { code: string; msg: string; data: boolean };
  if (result.msg === 'success') {
    onBatchDeleted();
  } else if (result.msg === 'fail') {
    window.$message?.error(result.data);
  } else {
    window.$message?.error($t('common.deleteFailed'));
  }
}

async function handleDelete(id: number) {
  const { error, response } = await AuthorizeApi.fetchDelete(id);
  if (error) {
    window.$message?.error($t('common.deleteFailed'));
    return;
  }
  const result = response.data as { code: string; msg: string; data: boolean };
  if (result.msg === 'success') {
    onDeleted();
  } else if (result.msg === 'fail') {
    window.$message?.error(result.data);
  } else {
    window.$message?.error($t('common.deleteFailed'));
  }
}

function edit(id: number) {
  handleEdit(id);
}

function handleAdd() {
  appStore.tabStore.removeActiveTab();
  router.push({ name: 'manage_authorize_action' });
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <AuthorizeSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.authorize.title')" :bordered="false" class="sm:flex-1-hidden card-wrapper">
      <template #extra>
        <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0" :loading="loading" @add="handleAdd" @delete="handleBatchDelete" @refresh="getData" />
      </template>
      <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" :row-selection="rowSelection" size="small" :scroll="scrollConfig"
        :loading="loading" row-key="id" :pagination="mobilePagination" class="h-full min-h-500px" bordered />
    </a-card>
  </div>
</template>

<style scoped></style>
