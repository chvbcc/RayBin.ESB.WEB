<script setup lang="tsx">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { $t, language } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import MessageSearch from './modules/message-search.vue';
import { fetchGetPagingList, fetchGetList } from '@/service/api/message';
import { useTable } from '@/hooks/common/table';
import { runModeRecord, taskTypeRecord, taskStatusRecord } from '@/constants/options';
import { debug } from 'console';

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

  // 缓存子表数据（key: 主表行ID, value: 子表数据），避免重复请求
  const subTableDataCache = ref<Record<number, any[]>>({});
  const expandedRowKeys = ref<number[]>([]);

  // 异步获取子表数据（带缓存）
  const getExpandedSubData = async (id: number) => {
    //if (subTableDataCache.value[id]) return subTableDataCache.value[id];
    const { error, data } = await fetchGetList(id);
    if (error) { return []; }
    subTableDataCache.value = {
      ...subTableDataCache.value,
      [id]: data || []
    };
    return;
  }

  // 处理行展开/收起事件
  const handleExpand = async (expanded: boolean, record: any) => {
    if (expanded) {
      if (!subTableDataCache.value[record.id]) {
        await getExpandedSubData(record.id);
      }
      expandedRowKeys.value.push(record.id);
    } else {
      const index = expandedRowKeys.value.indexOf(record.id);
      if (index > -1) {
        expandedRowKeys.value.splice(index, 1);
      }
    }
  };

  // 渲染展开的子表
  const expandedRowRender = (record: any) => {
    return (
      <div class="pl-24px">
        <a-table rowKey="id"
          columns={[
            { title: $t('page.message.messageType'), dataIndex: 'messageType', key: 'messageType' },
            { title: $t('page.message.employeeName'), dataIndex: 'employeeName', key: 'employeeName' },
            { title: $t('page.message.employeeNo'), dataIndex: 'employeeNo', key: 'employeeNo' },
            { title: $t('page.message.weCom'), dataIndex: 'weCom', key: 'weCom' },
            { title: $t('page.message.dingTalk'), dataIndex: 'dingTalk', key: 'dingTalk' },
            { title: $t('page.message.email'), dataIndex: 'email', key: 'email' },
          ]}
          dataSource={subTableDataCache.value[record.id] || []}
          pagination={false}
          size="small"
          class="sub-table"
        />
      </div>
    );
  };

  function refresh() {
    getData();
    subTableDataCache.value = {};
    expandedRowKeys.value = [];
  }
</script>
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <MessageSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.message.title')" :bordered="false" class="card-wrapper sm:flex-1-hidden">
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
      <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" size="small" :loading="loading" row-key="id" :pagination="mobilePagination" bordered
        :expanded-row-keys="expandedRowKeys"
        @expand="handleExpand"
      :expanded-row-render="expandedRowRender" />
    </a-card>
  </div>
</template>

<style scoped></style>

