<script setup lang="ts">
import { $t } from '@/locales';
import { useRouter } from 'vue-router';
import { computed, ref,onMounted } from 'vue';
import { fetchGetModel } from '@/service/api/log';
import { taskTypeRecord, logLevelRecord } from '@/constants/options';

// 获取路由信息
const router = useRouter();
const model = ref<Api.Log.TaskLogModel>(createDefaultModel());
function createDefaultModel(): Api.Log.TaskLogModel {
  return {
    id: 0,
    taskID: 0,
    taskType: '5000',
    taskName: '',
    spentTime: 0,
    logLevel: 0,
    message: '',
    createUserID: 0,
    createTime: '',
  };
}

// 获取 URL 参数中的 id
const taskId = computed(() => router.currentRoute.value.params.id);
onMounted(async () => {
  const { error, data } = await fetchGetModel(Number(taskId.value));
  if (!error) {
    model.value = data;
  } else {
    model.value = createDefaultModel();
  }
});

</script>
<template>
  <div class="min-h-500px flex flex-col h-full lt-sm:overflow-auto pr-3">
    <a-card :title="$t('page.taskLog.viewLogDetail')" :bordered="false" class="card-wrapper">
      <a-row :gutter="[16, 16]" wrap>
        <a-col :span="24" :md="4" :lg="4" class="title">{{ $t('page.taskLog.taskID') }}: </a-col>
        <a-col :span="24" :md="20" :lg="20">{{ model.taskID }}</a-col>
        <a-col :span="24" :md="4" :lg="4" class="title">{{ $t('page.taskLog.taskName') }}:</a-col>
        <a-col :span="24" :md="20" :lg="20">{{ model.taskName }}</a-col>
        <a-col :span="24" :md="4" :lg="4" class="title">{{ $t('page.taskLog.taskType') }}: </a-col>
        <a-col :span="24" :md="20" :lg="20">{{ $t(taskTypeRecord[model.taskType]) }}</a-col>
        <a-col :span="24" :md="4" :lg="4" class="title">{{ $t('page.taskLog.logLevel') }}:</a-col>
        <a-col :span="24" :md="20" :lg="20">{{ $t(logLevelRecord[model.logLevel]) }}</a-col>
        <a-col :span="24" :md="4" :lg="4" class="title">{{ $t('page.taskLog.spentTime') }}:</a-col>
        <a-col :span="24" :md="20" :lg="20">{{ model.spentTime }}</a-col>
        <a-col :span="24" :md="4" :lg="4" class="title">{{ $t('page.taskLog.createTime') }}:</a-col>
        <a-col :span="24" :md="20" :lg="20">{{ model.createTime }}</a-col>
        <a-col :span="24" :md="4" :lg="4" class="title">{{ $t('page.taskLog.message') }}:</a-col>
        <a-col :span="24" :md="20" :lg="20" style="min-height:80px;">{{ model.message }}</a-col>
        <a-col :span="24" :md="4" :lg="4" class="title">
          <a-button type="default" class="blue-btn" @click="router.back()">
            <icon-stash:arrow-reply-solid class="align-sub text-icon" />
             <span style="padding-left:5px;">{{$t('common.back')}}</span>
          </a-button></a-col>
      </a-row>
    </a-card>
  </div>
</template>

<style scoped>
  .title { font-weight: bold; }
</style>
