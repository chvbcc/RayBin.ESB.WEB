<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { TaskWebApi } from '@/service/api/task';
  import { useAuthStore } from '@/store/modules/auth';
  import RequestBody from '@/components/webapi/request/body.vue';
  import RequestHeader from '@/components/webapi/request/headers.vue';
  import QueryParameter from '@/components/webapi/request/parameters.vue';
  import { translateOptions, getPromptMessage } from '@/utils/common';
  import { locationOptions, methodOptions, interfaceTypeOptions  } from '@/constants/options';


  // 定义变量 参数 事件
  const authStore = useAuthStore();
  const authorizeOptions = ref<Api.Authorize.Authorize[]>([]);
  const emit = defineEmits(['update:visible', 'confirm']);
  const visible = defineModel<boolean>('visible', { default: false });
  const value = defineModel<Api.Task.TaskWebApi>('value', { default: () => ({}) });

  // 处理确定按钮
  function handleConfirm() {
    emit('confirm', value.value);
    visible.value = false;
  }

  // 处理取消按钮
  function handleCancel() {
    visible.value = false;
    emit('update:visible', false);
  }

  async function initData() {
    const userId = Number(authStore.userInfo.userId);
    const { error, data } = await TaskWebApi.fetchGetAuthorizes(userId);
    if (!error) {
      authorizeOptions.value = data.map((item: Api.Authorize.Authorize) => ({
        label: item.name,
        value: item.id
      }));
    }
  }

  onMounted(() => {
    initData();
  });
</script>

<template>
  <a-modal v-model:open="visible" :title="$t('page.webApi.requestInterface')" style="width: 90%; height: 80vh">
    <a-form ref="formRef" :model="value" layout="horizontal" class="h-full">
      <a-tabs default-active-key="1" class="h-full">
        <a-tab-pane :key="1" :tab="$t('page.webApi.interfaceInfo')">
          <a-card :title="$t('page.authorize.titleBaseInfo')" :bordered="true" class="mt-1">
            <a-row :gutter="[16, 16]" class="text-align-center">
              <a-col :span="24" :md="12" :lg="12">
                <a-form-item :label="$t('page.webApi.interfaceType')" name="interfaceType" class="m-2">
                  <a-select v-model:value="value.interfaceType" :options="translateOptions(interfaceTypeOptions)" :placeholder="$t('page.webApi.form.interfaceType')" class="w-full"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="12" :lg="12">
                <a-form-item :label="$t('page.webApi.authorize')" name="authorize" class="m-2">
                  <a-select v-model:value="value.authorize" :options="authorizeOptions" :placeholder="$t('page.webApi.form.authorize')" class="w-full"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="12" :lg="12">
                <a-form-item :label="$t('page.webApi.method')" name="method" class="m-2">
                  <a-select v-model:value="value.method" :options="methodOptions" :placeholder="$t('page.webApi.form.method')" class="w-full"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="12" :lg="12">
                <a-form-item :label="$t('page.webApi.timeOut')" name="timeOut" class="m-2">
                  <a-input-number v-model:value="value.timeOut" class="w-full" :min="0" :placeholder="$t('page.webApi.form.timeOut')" />
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="24" :lg="24">
                <a-form-item :label="$t('page.webApi.requestUrl')" name="requestUrl" class="m-2">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <a-input v-model:value="value.requestUrl" :placeholder="$t('page.webApi.form.requestUrl')" class="flex-1" />
                  <a-button type="primary" class="bule-btn ml-3">{{$t('page.task.dataHandle')}}</a-button>
                </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card :title="$t('page.webApi.requestBodyContent')" :bordered="true" class="mt-5">
            <a-tabs default-active-key="1" class="h-full">
              <a-tab-pane :key="1" :tab="$t('page.webApi.queryParameter')">
                <query-parameter style="height: 330px;" v-model:model="value.queryParameters" />
              </a-tab-pane>
              <a-tab-pane :key="2" :tab="$t('page.webApi.requestBody')">
                <request-body style="height: 330px;" v-model:model="value.requestBody" />
              </a-tab-pane>
              <a-tab-pane :key="3" :tab="$t('page.webApi.headers')">
                <request-header style="height: 330px;" v-model:model="value.headers" />
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-form>
    <template #footer>
      <a-space :size="13">
        <a-button @click="handleCancel">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style>
  .ant-card .ant-card-head { min-height: 45px !important; }
</style>
