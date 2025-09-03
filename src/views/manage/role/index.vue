<script setup lang="tsx">
import { $t } from '@/locales';
import { Button, Tag } from 'ant-design-vue';
import { RoleApi } from '@/service/api/manage';
import RoleSearch from './modules/role-search.vue';
import { enableStatusRecord } from '@/constants/business';
import RoleOperateDrawer from './modules/role-operate-drawer.vue';
import { useTable, useTableOperate, useTableScroll } from '@/hooks/common/table';

const { tableWrapperRef, scrollConfig } = useTableScroll();

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: RoleApi.fetchGetPagingList,
  apiParams: {
    current: 1,
    size: 10,
    roleName: undefined,
    isSystem: undefined,
    description: undefined,
    status: undefined
  },
  columns: () => [
    {
      key: 'index',
      dataIndex: 'index',
      title: $t('common.index'),
      width: 64,
      align: 'center'
    },
    {
      key: 'roleName',
      dataIndex: 'roleName',
      title: $t('page.manage.role.roleName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'isSystem',
      dataIndex: 'isSystem',
      title: $t('page.manage.role.isSystem'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: $t('page.manage.role.description'),
      minWidth: 120
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: $t('page.manage.role.status'),
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
        <div class="flex-center gap-8px">
          <Button type="primary" ghost size="small" onClick={() => edit(record.id)}>
            {$t('common.edit')}
          </Button>
          <a-popconfirm onConfirm={() => handleDelete(record.id)} title={$t('common.confirmDelete')}>
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
  drawerVisible,
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
  onBatchDeleted();
}

function handleDelete(id: number) {
  // request
  console.log(id);

  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.manage.role.title')" :bordered="false" :body-style="{ flex: 1, overflow: 'hidden' }" class="flex-col-stretch sm:flex-1-hidden card-wrapper">
      <template #extra>
        <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0" :loading="loading" @add="handleAdd" @delete="handleBatchDelete" @refresh="getData" />
      </template>
      <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" :row-selection="rowSelection" size="small"
        :loading="loading" row-key="id" :scroll="scrollConfig" :pagination="mobilePagination" class="h-full" bordered />
      <RoleOperateDrawer v-model:visible="drawerVisible" :operate-type="operateType" :row-data="editingData" @submitted="getDataByPage" />
    </a-card>
  </div>
</template>

<style scoped></style>
