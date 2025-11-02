<script setup lang="tsx">
import { ref } from 'vue';
import { $t } from '@/locales';
import { Button, Tag } from 'ant-design-vue';
import { RoleApi } from '@/service/api/manage';
import RoleSearch from './modules/role-search.vue';
import { useAuthStore } from '@/store/modules/auth';
import PermissionModal from './modules/permission-modal.vue';
import RoleOperateDrawer from './modules/role-operate-drawer.vue';
import { enableStatusRecord,yesOrNoRecord } from '@/constants/task';
import { useTable, useTableOperate, useTableScroll } from '@/hooks/common/table';

const authStore = useAuthStore();
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
      width: 98,
      minWidth: 98,
      customRender: ({ record }) => {
        if (record.isSystem === null) {
          return null;
        }
        const isSystemValue = record.isSystem ? 1 : 0;
        const label = $t(yesOrNoRecord[isSystemValue]);
        return label;
      }
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
      width: 170,
      customRender: ({ record }) => (
        <div class="flex-center justify-end">
          {record.roleName.toLowerCase() !== 'admin' && (
            <Button type="primary" ghost size="small" onClick={() => handlePermission(record.id)}>
              {$t('page.manage.permission.title')}
            </Button>
          )}
          <span class="mr-2" />
          <Button type="primary" ghost size="small" onClick={() => edit(record.id)}>
            {$t('common.edit')}
          </Button>
          <span class="mr-2" />
          <a-popconfirm onConfirm={() => handleDelete(record.id)} title={$t('common.confirmDelete')}>
            {record.isSystem === 0 && (
                <Button danger size="small">
                  {$t('common.delete')}
                </Button>
              )}
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

// 权限弹窗控制
const permissionModalVisible = ref(false);
const currentRoleId = ref<number | null>(null);

function handlePermission(id: number) {
  if (authStore.isAdmin()) { return; }
  currentRoleId.value = id;
  const roleData = data.value.find(item => item.id === id) || null;
  editingData.value = roleData;
  permissionModalVisible.value = true;
}

async function handleBatchDelete() {
  onBatchDeleted();
}

function handleDelete(id: number) {
  RoleApi.fetchDelete(id).then((res) => {
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
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.manage.role.title')" :bordered="false" :body-style="{ flex: 1, overflow: 'hidden' }" class="flex-col-stretch sm:flex-1-hidden card-wrapper">
      <template #extra>
        <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0" :loading="loading" @add="handleAdd" @delete="handleBatchDelete" @refresh="getData" />
      </template>
      <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" :row-selection="rowSelection" size="small"
        :loading="loading" row-key="id" :scroll="scrollConfig" :pagination="mobilePagination" class="h-full" bordered />
      <RoleOperateDrawer v-model:visible="drawerVisible" :operate-type="operateType" :row-data="editingData" @submitted="getDataByPage" />
      <PermissionModal v-model:visible="permissionModalVisible" :role-id="currentRoleId" @submitted="getDataByPage" />
    </a-card>
  </div>
</template>

<style scoped></style>
