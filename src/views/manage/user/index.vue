<script setup lang="tsx">
import { $t } from '@/locales';
import { Button, Tag } from 'ant-design-vue';
import  { UserApi }  from '@/service/api/manage';
import UserSearch from './modules/user-search.vue';
import UserOperateModal from './modules/user-operate-modal.vue';
import { enableStatusRecord, userGenderRecord } from '@/constants/manage';
import { useTable, useTableOperate, useTableScroll } from '@/hooks/common/table';

const { tableWrapperRef, scrollConfig } = useTableScroll();

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: UserApi.fetchGetPagingList,
  apiParams: {
    current: 1,
    size: 10,
    username: undefined,
    employeeName: undefined,
    email: undefined,
    status: undefined,
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
      key: 'username',
      dataIndex: 'username',
      title: $t('page.manage.user.username'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'gender',
      title: $t('page.manage.user.gender'),
      align: 'center',
      dataIndex: 'gender',
      width: 100,
      customRender: ({ record }) => {
        if (record.gender === null) {
          return null;
        }
        const label = $t(userGenderRecord[record.gender]);
        return label;
      }
    },
    {
      key: 'employeeName',
      dataIndex: 'employeeName',
      title: $t('page.manage.user.employeeName'),
      align: 'center',
      width: 120
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: $t('page.manage.user.email'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: $t('page.manage.user.status'),
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        if (record.status === null) {
          return null;
        }
        const tagMap: Record<Api.Common.EnableStatus, string> = {
          0: 'success',
          1: 'warning'
        };
        const label = $t(enableStatusRecord[record.status]);
        return <Tag color={tagMap[record.status]}>{label}</Tag>;
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

const {
  drawerVisible: modalVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  rowSelection,
  onBatchDeleted,
  onDeleted
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  if (checkedRowKeys.value.length === 0) return;
  const res = await UserApi.fetchDeletes(checkedRowKeys.value);
  if (!res.error) {
    const result = res.response.data;
    if (result.msg === 'success' && result.data === true) {
      window.$message?.success($t('common.deleteSuccess'));
      onBatchDeleted();
    } else if (result.msg === 'fail') {
      window.$message?.error(String(result.data));
    } else {
      window.$message?.error($t('common.deleteFailed'));
    }
  }
}

function handleDelete(id: number) {
  UserApi.fetchDelete(id).then((res) => {
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

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.manage.user.title')" :bordered="false" :body-style="{ flex: 1, overflow: 'hidden' }" class="flex-col-stretch sm:flex-1-hidden card-wrapper">
      <template #extra>
        <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0" :loading="loading" @add="handleAdd" @delete="handleBatchDelete" @refresh="getData" />
      </template>
      <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" :row-selection="rowSelection" size="small" :loading="loading" row-key="id" :scroll="scrollConfig" :pagination="mobilePagination" class="h-full" bordered />
      <UserOperateModal v-model:visible="modalVisible" :operate-type="operateType" :row-data="editingData" @submitted="getDataByPage" />
    </a-Card>
  </div>
</template>

<style scoped></style>
