<script setup lang="ts">
import HeaderBanner from './modules/header-banner.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';
import CreativityBanner from './modules/creativity-banner.vue';
import { ref,onMounted } from 'vue';
import { TaskApi } from '@/service/api/task';

interface TaskCounts {
  taskCount: number;
  pendingTaskCount: number;
  suspendedTaskCount: number;
  databaseTaskCount: number;
  webApiTaskCount: number;
  industriaTaskCount: number;
  dataMonitorTaskCount: number;
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

onMounted(async() => {
    const { error, data } = await TaskApi.fetchGetTaskCount();
    if (!error && data)  {
      taskCountModel.value = data;
    }
});

</script>

<template>
  <a-space direction="vertical" :size="16">
    <HeaderBanner :taskCount="taskCountModel.taskCount" :pendingTaskCount="taskCountModel.pendingTaskCount" :suspendedTaskCount="taskCountModel.suspendedTaskCount" />
    <CardData :databaseTaskCount="taskCountModel.databaseTaskCount" :webApiTaskCount="taskCountModel.webApiTaskCount" :industriaTaskCount="taskCountModel.industriaTaskCount" :dataMonitorTaskCount="taskCountModel.dataMonitorTaskCount" />
    <a-row :gutter="[16, 16]">
      <a-col :span="24" :lg="14">
        <LineChart />
      </a-col>
      <a-col :span="24" :lg="10">
        <PieChart />
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
      <a-col :span="24" :lg="14">
        <ProjectNews />
      </a-col>
      <a-col :span="24" :lg="10">
        <CreativityBanner />
      </a-col>
    </a-row>
  </a-space>
</template>

<style scoped></style>
