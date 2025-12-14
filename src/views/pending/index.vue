<script setup lang="tsx">
import { reactive } from 'vue';
import { $t, language } from '@/locales';
import TaskSearch from './task-search.vue';
import { TaskApi } from '@/service/api/task';
import { useTable } from '@/hooks/common/table';
import { dataHandleRecord, taskTypeRecord, runModeRecord, taskStatusRecord, yesOrNoRecord } from '@/constants/options';

// 添加响应式加载映射，追踪每个任务加载状态
const taskLoadingMap = reactive<Record<number, boolean>>({});

const { columns, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: TaskApi.fetchGetPendingList,
  apiParams: {
    current: 1,
    size: 10,
    taskName: undefined,
    taskType: undefined,
    runMode: undefined,
    description: undefined,
    status: 0
  },
  columns: () => [
    {
      key: 'id',
      dataIndex: 'id',
      title: $t('page.task.id'),
      width: 80,
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
      key: 'isDebug',
      dataIndex: 'isDebug',
      title: $t('page.task.isDebug'),
      width: 80,
      align: 'center',
      customRender: ({ record } )=> {
        if (record.isDebug === null) {
          return null;
        }
        const isdebug = record.isDebug ? 1 : 0;
        const label = $t(yesOrNoRecord[isdebug]);
        return label;
      }
    },
    {
      key: 'dataHandle',
      dataIndex: 'dataHandle',
      title: $t('page.task.dataHandle'),
      align: 'center',
      width: 110,
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
      width: 130,
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
      width: 180,
      customRender: ({ record }) => {
        return record.runTime == '0001-01-01T00:00:00' ? '' : record.runTime;
      }
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: $t('page.task.status'),
      align: 'center',
      width: 90,
      customRender: ({ record })=> {
        if (record.status === null) {
          return null;
        }
        const label = $t(taskStatusRecord[record.status]);
        return label;
      }
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: $t('page.task.description'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      customRender:  ({ record })=> (
        <div class="flex-center gap-8px">
          <a-button type="default" class={`green-btn row-btn ${language() === 'en-US' ? 'en-edit' : ''}`} loading={taskLoadingMap[record.id]} onClick={() => runTask(record.id)} >
            <icon-ic-outline-play-circle class="align-sub text-icon" />
             <span>{$t('page.task.run')}</span>
          </a-button>
          <a-button type="default" class="red-btn row-btn" onClick={() => pauseTask(record.id)}>
            <icon-ic-outline-pause-circle class="align-sub text-icon" />
            <span>{$t('page.task.pause')}</span>
          </a-button>
        </div>
      )
    }
  ]
});

async function runTask(id: number) {
  taskLoadingMap[id] = true;
  try {
    await TaskApi.fetchRunTask(id);
  } finally {
    taskLoadingMap[id] = false;
  }
}

async function pauseTask(id: number) {
  const { error, response } = await TaskApi.fetchSetStatus(id, 2);;
  if (error) { window.$message?.error($t('common.updateFailed')); return; }
  const result = response.data as { code: string; msg: string; data: string };
  if (result.msg === "success") {
    getData();
    window.$message?.success($t('common.updateSuccess'));
  } else if (result.msg === "fail") {
    window.$message?.error(result.data);
  } else {
    window.$message?.error($t('common.updateFailed'));
  }
}

</script>
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TaskSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.database.title')" :bordered="false" class="card-wrapper sm:flex-1-hidden">
      <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" size="small" :loading="loading" row-key="id" :pagination="mobilePagination" bordered />
    </a-card>
  </div>
</template>

<style scoped></style>
