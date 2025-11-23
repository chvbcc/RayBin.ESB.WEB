<script setup lang="ts">
  import { $t, language } from '@/locales';
  import Headers from './modules/headers.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAppStore } from '@/store/modules/app';
  import QueryParameters from './modules/parameters.vue';
  import { onMounted, computed, ref, watch } from 'vue';
  import { useAntdForm, useFormRules } from '@/hooks/common/form';
  import { fetchGetConnectionOptions } from '@/service/api/connection';
  import { translateOptions } from '@/utils/common';
  import { methodOptions } from '@/constants/token';

  // #region 1. 参数定义
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();
  const { formRef: formRefTask } = useAntdForm();

  const dataObjectModalVisible = ref(false);

  const dataSource = ref<any[]>([]);
  const selectedDataObjectNames = ref<string[]>([]);


  const queryParams = ref<Api.Token.Param[]>([]);
  const headerParams = ref<Api.Token.Param[]>([]);
  const parametersRef = ref<InstanceType<typeof QueryParameters>>();
  const headersRef = ref<InstanceType<typeof Headers>>();

  // 根据语言动态设置 labelCol 宽度
  const labelCol = language() === 'en-US' ?  { style: { width: '141px' } } :  { style: { width: '100px' } };

  // 定义默认模型
  const model = ref<Api.Token.TokenModel>(createDefaultModel());

  function createDefaultModel(): Api.Token.TokenModel {
    return {
        id: 0,
        tokenName: '',
        method: undefined,
        requestUrl: '',
        timeOut: 180,
        queryParameters: '',
        bodyType: '',
        bodyContent: '',
        headers: '',
        authType: '',
        authContent: '',
        programmeLanguage: '',
        checkCallResult: '',
        tokenField: '',
        description: '',
        startCreateTime: undefined,
        endCreateTime: undefined
    };
  }
  //#endregion


  // #region 3. 初始化时
  onMounted(async () => {
    // 从路由参数中获取ID （加载编辑数据）
    const id = Number(route.query.id ?? 0);
    if (id) {
      // const { error, data } = await fetchGetModel(id);
      // if (!error && data) {
      //   model.value = {
      //     task: { ...createDefaultModel().task, ...data.task },
      //     taskDatabase: { ...createDefaultModel().taskDatabase, ...data.taskDatabase }
      //   };
      //   relationDiagramRef.value?.setData(JSON.parse(data.taskDatabase.diagramData));
      // }
    }
  });
  // #endregion


  // #region 5. 保存数据对象
  async function handleSave() {
    formRefTask.value?.validate().then(async () => {
      // model.value.taskDatabase.diagramData = JSON.stringify(relationDiagramRef.value?.getData());
      // const payload: Api.Task.TaskDatabaseModel = {
      //   task: { ...model.value.task },
      //   taskDatabase: { ...model.value.taskDatabase }
      // };

      // // 提交保存
      // const { error, response } = await fetchSave(payload);
      // if (error) { window.$message?.error(getPromptMessage(route.query, "Failed")); return; }
      // const result = response.data as { code: string; msg: string; data: string };
      // if (result.msg === 'success') {
      //   window.$message?.success(getPromptMessage(route.query, "Success"));
      //   appStore.tabStore.removeActiveTab();
      //   router.push({ name: 'database' });
      // } else if (result.msg === 'fail') {
      //   window.$message?.error(result.data);
      // } else {
      //   window.$message?.error(getPromptMessage(route.query, "Failed"));
      // }
    }).catch(() => {
      return;
    });
  }
  // #endregion

  // #region 7. 返回数据库列表
  function handleBack() {
    appStore.tabStore.removeActiveTab();
    router.push({ name: 'database' });
  }
  // #endregion

  // #region 11. 监听语言变化，动态更新 labelCol 的宽度
  watch(language, (newLang) => {
    labelCol.style.width = newLang === 'en-US' ? '130px' : '100px';
  });
  // #endregion

  const activeKey = ref('1');
</script>

<template>
  <div class="min-h-500px flex flex-col h-full lt-sm:overflow-auto pr-3">
    <a-form ref="formRefTask" :model="model" :label-col="labelCol">
      <a-card :title="$t('page.token.titleBaseInfo')" :bordered="false">
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.token.tokenName')" name="tokenName" class="m-0">
                <a-input v-model:value="model.tokenName" :placeholder="$t('page.token.form.tokenName')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.token.description')" name="description" class="m-0">
                <a-input v-model:value="model.description" :placeholder="$t('page.token.form.description')" />
              </a-form-item>
            </a-col>

            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.token.method')" name="method" class="m-0">
                <a-select v-model:value="model.method" :placeholder="$t('page.token.form.method')" :options="translateOptions(methodOptions)" allow-clear  />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.token.timeOut')" name="timeOut" class="m-0">
                <a-input-number v-model:value="model.timeOut" :placeholder="$t('page.token.form.timeOut')" class="w-full" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="24" :lg="24">
              <a-form-item :label="$t('page.token.requestUrl')" name="requestUrl" class="m-0">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <a-input v-model:value="model.requestUrl" :placeholder="$t('page.token.form.requestUrl')" class="flex-1" />
                  <a-button type="primary" class="orange-btn ml-3">{{$t('page.database.addMapping')}}</a-button>
                </div>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.programmeLanguage')" name="programmeLanguage" class="m-0">
                <a-select v-model:value="model.task.programmeLanguage" :placeholder="$t('page.task.form.programmeLanguage')" :options="programmeLanguageOptions" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.dataHandle')" name="dataHandle" class="m-0">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <a-select v-model:value="model.task.dataHandle" :placeholder="$t('page.task.form.dataHandle')" :options="convertOptions(dataHandleOptions)" class="flex-1" />
                  <a-button type="primary" class="bule-btn ml-3" @click="showDataHandleModal()">{{$t('page.task.dataHandle')}}</a-button>
                </div>
              </a-form-item>
            </a-col> -->
          </a-row>
      </a-card>
      <a-card :title="$t('page.token.titleRequest')" :bordered="false" class="mb-4">
        <div class="request">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" :tab="$t('page.token.queryParameters')">
              <QueryParameters ref="parametersRef" v-model="queryParams" />
            </a-tab-pane>
            <a-tab-pane key="2" :tab="$t('page.token.header')">
              <Headers ref="headersRef" v-model="headerParams" />
            </a-tab-pane>
            <a-tab-pane key="3" :tab="$t('page.token.body')">
              {{ $t('page.token.body') }}
            </a-tab-pane>
            <a-tab-pane key="4" :tab="$t('page.token.authorization')">
              {{ $t('page.token.authorization') }}
            </a-tab-pane>
          </a-tabs>
          </div>
      </a-card>
      <a-card :title=" $t('page.token.titleResponse')" :bordered="false" class="flex flex-col flex-1">
        <div class="flex flex-col h-full flex-1">
          <a-row :gutter="[16, 16]" class="mt-4 text-align-center">
              <a-col :span="24" :md="24" :lg="24">
                <a-button type="primary" @click="handleSave" class="blue-btn mr-8 pl-6 pr-6">
                  {{$t('common.save')}}
                </a-button>
                <a-button type="primary" @click="handleBack" ghost class=" pl-6 pr-6">
                  {{$t('common.back')}}
                </a-button>
              </a-col>
            </a-row>
        </div>
      </a-card>
    </a-form>
    <DataObjectModal v-model:visible="dataObjectModalVisible" :selected-data-object-names="selectedDataObjectNames" />
  </div>
</template>
<style scoped>
  .flex-1 {flex: 1 !important; }
  .request { padding: 0px 20px 20px 20px; min-height: 200px; }
  .diagram-container { background-color: #fCfCfC; border: #ECF0F1 1px solid; position: relative; }
  ::v-deep .ant-card .ant-card-body { height: 100%; flex: 1; box-sizing: border-box; overflow: hidden; }
</style>
