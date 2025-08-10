<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { databaseTypeRecord } from '@/constants/business';
import { fetchGetConnectionList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import ConnectionSearch from './modules/connection-search.vue';

const appStore = useAppStore();

const { columns, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchGetConnectionList,
  apiParams: {
    current: 1,
    size: 10,
    connectionName: null,
    databaseType: null,
    hostName: null,
    databases: null
  },
  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      width: 66,
      align: 'center'
    },
    {
      key: 'connectionName',
      title: $t('page.connection.connectionName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'databaseType',
      title: $t('page.connection.databaseType'),
      align: 'center',
      width: 120,
      render: row => {
        if (row.databaseType === null) {
          return null;
        }
        const label = $t(databaseTypeRecord[row.databaseType]);
        return label;
      }
    },
    {
      key: 'hostName',
      title: $t('page.connection.hostName'),
      minWidth: 120
    },
    {
      key: 'databases',
      title: $t('page.connection.databases'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

async function handleAdd() {
  appStore.tabStore.replaceTab("connection-new");
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
    <ConnectionSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard :title="$t('page.connection.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <NSpace wrap justify="end" class="lt-sm:w-200px">
          <slot name="prefix"></slot>
          <slot name="default">
            <NButton size="small" type="primary" @click="handleAdd">
              <template #icon>
                <icon-ic-round-plus class="text-icon" />
              </template>
              {{ $t('common.add') }}
            </NButton>
          </slot>
          <NButton size="small" @click="getData">
            <template #icon>
              <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
            </template>
            {{ $t('common.refresh') }}
          </NButton>
        </NSpace>
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :loading="loading"
        :single-line="false"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
      />
      <RoleOperateDrawer v-model:visible="drawerVisible" :operate-type="operateType" :row-data="editingData" @submitted="getDataByPage" />
    </NCard>
  </div>
</template>

<style scoped></style>
