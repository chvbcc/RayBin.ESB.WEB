<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { TaskApi } from '@/service/api/task';
import PieChart from './modules/pie-chart.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import { getTaskSpentTime } from '@/service/api/log';
import TaskLogs from './modules/task-logs.vue';
import HeaderBanner from './modules/header-banner.vue';

interface TaskCounts {
  taskCount: number;
  pendingTaskCount: number;
  suspendedTaskCount: number;
  databaseTaskCount: number;
  webApiTaskCount: number;
  industriaTaskCount: number;
  dataMonitorTaskCount: number;
}

interface TaskSpentTime {
  databaseTaskSpentTime: number[];
  webApiTaskSpentTime: number[];
  industriaTaskSpentTime: number[];
  dataMonitorTaskSpentTime: number[];
}

const taskCountModel = ref<TaskCounts>({
  taskCount: 0,
  pendingTaskCount: 0,
  suspendedTaskCount: 0,
  databaseTaskCount: 0,
  webApiTaskCount: 0,
  industriaTaskCount: 0,
  dataMonitorTaskCount: 0
});

const taskSpentTimeModel = ref<TaskSpentTime>({
  databaseTaskSpentTime: [],
  webApiTaskSpentTime: [],
  industriaTaskSpentTime: [],
  dataMonitorTaskSpentTime: []
});

onMounted(async() => {
    const { error: errorCount, data: dataCount } = await TaskApi.fetchGetTaskCount();
    if (!errorCount && dataCount)  {
      taskCountModel.value = dataCount;
    }
    const {error: errorSpentTime, data: dataSpentTime } = await getTaskSpentTime();
    if (!errorSpentTime && dataSpentTime) {
      taskSpentTimeModel.value = dataSpentTime;
    }
});

</script>

<template>
  <a-space direction="vertical" :size="16">
    <HeaderBanner :taskCount="taskCountModel.taskCount" :pendingTaskCount="taskCountModel.pendingTaskCount" :suspendedTaskCount="taskCountModel.suspendedTaskCount" />
    <CardData :taskCountModel="taskCountModel" />
    <a-row :gutter="[16, 16]">
      <a-col :span="24" :lg="14">
        <LineChart :taskSpentTimeModel="taskSpentTimeModel" />
      </a-col>
      <a-col :span="24" :lg="10">
        <PieChart :taskCountModel="taskCountModel" />
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
      <a-col :span="24" :lg="24">
        <TaskLogs />
      </a-col>
    </a-row>
  </a-space>
</template>

<style scoped></style>
