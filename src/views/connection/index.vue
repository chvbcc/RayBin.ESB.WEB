<script setup lang="tsx">
import { databaseTypeRecord } from '@/constants/business';
import { fetchGetConnectionList } from '@/service/api';
import { useTable, useTableOperate } from '@/hooks/common/table';
import ConnectionSearch from './modules/connection-search.vue';
import { useAppStore } from '@/store/modules/app';
import { useRouter } from 'vue-router';
import { $t } from '@/locales';

const router = useRouter();
const appStore = useAppStore();

const { columns, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchGetConnectionList,
  apiParams: {
    current: 1,
    size: 10,
    connectionName: undefined,
    databaseType: undefined,
    hostName: undefined,
    databases: undefined
  },
  columns: () => [
    {
      key: 'index',
      dataIndex: 'index',
      title: $t('common.index'),
      width: 66,
      align: 'center'
    },
    {
      key: 'connectionName',
      dataIndex: 'connectionName',
      title: $t('page.connection.connectionName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'databaseType',
      dataIndex: 'databaseType',
      title: $t('page.connection.databaseType'),
      align: 'center',
      minWidth: 120,
      customRender: ({ record } )=> {
        if (record.databaseType === null) {
          return null;
        }
        const label = $t(databaseTypeRecord[record.databaseType]);
        return label;
      }
    },
    {
      key: 'hostName',
      dataIndex: 'hostName',
      title: $t('page.connection.hostName'),
      minWidth: 120
    },
    {
      key: 'databases',
      dataIndex: 'databases',
      title: $t('page.connection.databases'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      customRender:  ({ record })  => (
        <div class="flex-center gap-8px">
          <a-button type="default" class="table-edit-btn" onClick={() => edit(record.id)}>
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

const {handleEdit, onDeleted } = useTableOperate(data, getData);

async function handleAdd() {
  appStore.tabStore.removeActiveTab();
  router.push({ name: 'connection-new' });
}

function handleDelete(id: number) {
  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}

function refresh() {
  getData();
}
</script>
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ConnectionSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.connection.title')" :bordered="false" class="card-wrapper sm:flex-1-hidden">
      <template #extra>
          <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
          <slot name="prefix"></slot>
          <slot name="default">
            <a-button type="primary" class="blue-btn" @click="handleAdd">
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
