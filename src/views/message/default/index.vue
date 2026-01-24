<script setup lang="tsx">
import { useRouter } from 'vue-router';
import { $t, language } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import MessageSearch from './modules/message-search.vue';
import { fetchGetPagingList, fetchGetList } from '@/service/api/message';
import { useTable } from '@/hooks/common/table';
import { runModeRecord, taskTypeRecord, taskStatusRecord } from '@/constants/options';

const router = useRouter();
const appStore = useAppStore();

const { columns, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchGetPagingList,
  apiParams: {
    current: 1,
    size: 10,
    taskName: undefined,
    taskType: undefined,
    runMode: undefined,
    employeeName: "",
  },
  columns: () => [
    {
      key: 'id',
      dataIndex: 'id',
      title: $t('page.message.taskID'),
      width: 88,
      align: 'center'
    },
    {
      key: 'taskName',
      dataIndex: 'taskName',
      title: $t('page.message.taskName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'taskType',
      dataIndex: 'taskType',
      title: $t('page.task.taskType'),
      align: 'center',
      width: 138,
      customRender: ({ record }) => {
        if (record.taskType === null) {
          return null;
        }
        const label = $t(taskTypeRecord[record.taskType]);
        return label;
      }
    },
    {
      key: 'runMode',
      dataIndex: 'runMode',
      title: $t('page.message.runMode'),
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
      key: 'status',
      dataIndex: 'status',
      title: $t('page.message.taskStatus'),
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
          <a-button type="default" class="blue-btn row-btn" onClick={() => handleAssignUser(record.id)} >
            <icon-mdi-account-plus class="align-sub text-16px" />
            <span>{$t('page.message.assignUser')}</span>
          </a-button>
        </div>
      )
    }
  ]
});

async function handleAssignUser (taskId: number) {
  appStore.tabStore.removeActiveTab();
  router.push({ name: 'database_action' });
}

// 渲染展开的子表
const expandedRowRender = async (taskId: number) => {
  // 这里可以使用 record 数据渲染子表
  const { error, response } = await fetchGetList(taskId);
  if (error) { return; }
  const result = response.data as { code: string; msg: string; data: string };
  const subTableData = result.data ? JSON.parse(result.data) : [];
  return (
    <div class="pl-24px">
      <a-table rowKey="id"
        columns={[
          { title: $t('page.message.messageContent'), dataIndex: 'messageContent', key: 'messageContent' },
          { title: $t('page.message.sendTime'), dataIndex: 'sendTime', key: 'sendTime' },
          { title: $t('page.message.status'), dataIndex: 'status', key: 'status' },
          { title: $t('page.message.receiver'), dataIndex: 'receiver', key: 'receiver' }
        ]}
        dataSource={subTableData}
        pagination={false}
        size="small"
        class="sub-table"
      />
    </div>
  );
};

function refresh() {
  getData();
}
</script>
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <MessageSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.database.title')" :bordered="false" class="card-wrapper sm:flex-1-hidden">
      <template #extra>
          <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
          <slot name="prefix"></slot>
          <a-button type="primary" ghost @click="refresh">
            <template #icon>
              <icon-mdi-refresh class="align-sub text-icon" :class="{ 'animate-spin': loading }" />
            </template>
            <span class="ml-0px">{{ $t('common.refresh') }}</span>
          </a-button>
        </div>
      </template>
      <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" size="small" :loading="loading" row-key="id" :pagination="mobilePagination" bordered :expanded-row-render="expandedRowRender" />
    </a-card>
  </div>
</template>

<style scoped></style>

