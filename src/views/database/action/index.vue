<script setup lang="tsx">
  import { $t, language } from '@/locales';
  import { onMounted, computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAppStore } from '@/store/modules/app';
  import { useAuthStore } from '@/store/modules/auth';
  import { TaskDatabaseApi } from '@/service/api/task';
  import DataObjectModal from './modules/data-object-modal.vue';
  import DataHandleModal from './modules/data-handle-modal.vue';
  import { useAntdForm, useFormRules } from '@/hooks/common/form';
  import { fetchGetConnectionOptions } from '@/service/api/connection';
  import RelationDiagram from '@/components/database/relation-diagram.vue';
  import { convertOptions, translateOptions, convertDateTime, getPromptMessage } from '@/utils/common';
  import { booleanYesOrNoOptions, dataHandleOptions, runModeOptions, dataObjectTypeOptions, taskStatusOptions, programmeLanguageOptions } from '@/constants/options';

  // #region 1. 参数定义
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const { formRef: formRefTask } = useAntdForm();
  const { formRef: formRefDialog } = useAntdForm();


  const { defaultRequiredRule } = useFormRules();
  const relationDiagramRef =  ref<InstanceType<typeof RelationDiagram>>();

  const connectionOptions = ref<{ label: string; value: number }[]>([]);
  const dataHandleModalVisible = ref(false);
  const dataObjectModalVisible = ref(false);


  const dialogModel = ref<Api.Task.DialogModal>({connectionID: undefined, dataObjectType: 'table'});
  const selectedDataObjectNames = ref<string[]>([]);

  // 根据语言动态设置 labelCol 宽度
  const labelCol =  computed(() =>language() === 'en-US' ?  { style: { width: '141px' } } :  { style: { width: '100px' } });

  // 定义默认模型
  const model = ref<Api.Task.TaskDatabaseModel>(createDefaultModel());

  const runTimeValue = computed<string | undefined>({
    get: () => convertDateTime(model.value.task.runTime),
    set: value => {
        model.value.task.runTime = convertDateTime(value);
    }
  });

  function createDefaultModel(): Api.Task.TaskDatabaseModel {
    return {
      task: {
        id: 0,
        taskType: '5000',
        taskName: '',
        runMode: '6000',
        runFrequency: 0, // 应为数字类型
        runTime: undefined,
        isDebug: false,
        status: 0,
        description: ''
      },
      taskDatabase: {
        id: 0,
        taskID: 0,
        dataHandle: 0,
        dataHandleLanguage: '7000',
        dataHandleScript: '',
        dataMapping: '',
        diagramData: '',
      }
    };
  }
  //#endregion

  // #region 2. 定义规则类型 验证表单
  const taskNameRule: App.Global.FormRule = {
    required: true, // 添加 required: true，确保显示星号
    validateTrigger: ['change', 'blur'],
    validator: async (_rule: any, value: string) => {
      const name = (value ?? '').trim();
      if (!name) {
        return Promise.reject(new Error(($t('page.connection.form.connectionName') as string)));
      }
      const createUserId = parseInt(authStore.userInfo.userId) ?? 0;
      const { error, data } = await TaskDatabaseApi.fetchCheckName(name, createUserId, model.value.task.id);
      if (error && data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    }
  };

  type dialogRuleKey = Extract<keyof Api.Task.DialogModal, 'connectionID' | 'dataObjectType'>;
  const dialogRules = computed<Record<dialogRuleKey, App.Global.FormRule>>(() => {
    return {
      connectionID: defaultRequiredRule,
      dataObjectType: defaultRequiredRule,
    };
  });
  // #endregion

  // #region 3. 初始化时
  onMounted(async () => {
    // 获取连接列表并转换为 options
    const { error, data  } = await fetchGetConnectionOptions();
    if (!error) {
      connectionOptions.value = data.map(item => ({
        label: item.connectionName,
        value: item.id
      }));
    }
    // 从路由参数中获取ID （加载编辑数据）
    const id = Number(route.query.id ?? 0);
    if (id) {
      const { error, data } = await TaskDatabaseApi.fetchGetModel(id);
      if (!error && data) {
        model.value = {
          task: { ...createDefaultModel().task, ...data.task },
          taskDatabase: { ...createDefaultModel().taskDatabase, ...data.taskDatabase }
        };
        relationDiagramRef.value?.setData(JSON.parse(data.taskDatabase.diagramData));
      }
    }
  });
  // #endregion

  // #region 4. 显示对话框
  // 数据处理对话框
  function showDataHandleModal()  {
    dataHandleModalVisible.value = true;
  }

  //显示数据对象模态框
  function showDataObjectModal() {
    formRefDialog.value?.validate(['connectionID', 'dataObjectType']).then(() => {
      selectedDataObjectNames.value = relationDiagramRef.value?.getDataObjectNames() || [];
      dataObjectModalVisible.value = true;
    })
  }
  // #endregion

  // #region 5. 保存数据对象
  async function handleSave() {
    formRefTask.value?.validate().then(async () => {
      model.value.taskDatabase.diagramData = JSON.stringify(relationDiagramRef.value?.getData());
      const payload: Api.Task.TaskDatabaseModel = {
        task: { ...model.value.task },
        taskDatabase: { ...model.value.taskDatabase }
      };

      // 提交保存
      const { error, response } = await TaskDatabaseApi.fetchSave(payload);
      if (error) { window.$message?.error(getPromptMessage(route.query, "Failed")); return; }
      const result = response.data as { code: string; msg: string; data: string };
      if (result.msg === 'success') {
        window.$message?.success(getPromptMessage(route.query, "Success"));
        appStore.tabStore.removeActiveTab();
        router.push({ name: 'database' });
      } else if (result.msg === 'fail') {
        window.$message?.error(result.data);
      } else {
        window.$message?.error(getPromptMessage(route.query, "Failed"));
      }
    }).catch(() => {
      return;
    });

    if (model.value.task.status == 0 && relationDiagramRef.value?.validateUnusedNodes()) {
      window.$message?.error($t('page.database.needDataMapping'));
      return;
    }
  }
  // #endregion

  // #region 7. 返回数据库列表
  function handleBack() {
    appStore.tabStore.removeActiveTab();
    router.push({ name: 'database' });
  }
  // #endregion

  // #region 8. 删除数据对象
  function handleDelete(deleteItems: string[], dataObjectType: Api.Task.DataObjectType) {
    relationDiagramRef.value?.deleteDataObjects(deleteItems, dataObjectType);
  }
  // #endregion

  // #region 9. 添加数据对象
  function handleAdd(dataObjectNodes: Api.Task.DataObjectNode[]) {
    relationDiagramRef.value?.addDataObjects(dataObjectNodes);
  }
  // #endregion

  // #region 10. isDebug 计算属性，用于在 Select 组件中绑定 'true'/'false' 字符串值
  const booleanYesOrNoValue = computed({
    get: () => model.value.task.isDebug ? 'true' : 'false',
    set: (val: 'true' | 'false') => { model.value.task.isDebug = val === 'true'; }
  });
  // #endregion

  // #region 11. 处理DataHandleModal返回的内容
  function handleConfirm(content: string) {
    model.value.taskDatabase.dataHandleScript = content;
    dataHandleModalVisible.value = false;
  }
  // #endregion
</script>

<template>
  <div class="min-h-500px flex flex-col h-full lt-sm:overflow-auto pr-3">
    <a-form ref="formRefTask" :model="model" :label-col="labelCol" class="flex flex-col">
      <a-card :title="$t('page.database.titleBaseInfo')" :bordered="false" class="mb-4">
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.taskName')" :name="['task','taskName']" :rules="taskNameRule" class="m-0">
                <a-input v-model:value="model.task.taskName" :placeholder="$t('page.task.form.taskName')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.isDebug')" :name="['task', 'isDebug']" :rules="[{ required: true }]" class="m-0">
                <a-select v-model:value="booleanYesOrNoValue" :placeholder="$t('page.task.form.isDebug')" :options="translateOptions(booleanYesOrNoOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runMode')" :name="['task', 'runMode']" :rules="[{ required: true }]" class="m-0">
                <a-select v-model:value="model.task.runMode" :placeholder="$t('page.task.form.runMode')" :options="translateOptions(runModeOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runTime')" :name="['task', 'runTime']" :rules="[{required: model.task.runMode !== '6000'}]" class="m-0">
                <a-date-picker v-model:value="runTimeValue" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"show-time :placeholder="$t('page.task.runTime')" style="width: 100%;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.database.dataHandleLanguage')" :name="['taskDatabase', 'dataHandleLanguage']" :rules="[{required: model.taskDatabase.dataHandle == 1}]" class="m-0">
                <a-select v-model:value="model.taskDatabase.dataHandleLanguage" :placeholder="$t('page.database.form.dataHandleLanguage')" :options="programmeLanguageOptions" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.status')" :name="['task', 'status']" :rules="[{ required: true }]" class="m-0">
                <a-select v-model:value="model.task.status" :placeholder="$t('page.task.form.status')" :options="convertOptions(taskStatusOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.database.dataHandle')" :name="['taskDatabase', 'dataHandle']" class="m-0">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <a-select v-model:value="model.taskDatabase.dataHandle" :placeholder="$t('page.database.form.dataHandle')" :options="convertOptions(dataHandleOptions)" class="flex-1" />
                  <a-button type="primary" class="bule-btn ml-3" @click="showDataHandleModal()">{{$t('page.database.dataHandle')}}</a-button>
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.description')" name="description" class="m-0">
                <a-input v-model:value="model.task.description" :placeholder="$t('page.task.form.description')" />
              </a-form-item>
            </a-col>
          </a-row>
      </a-card>
    </a-form>
    <a-form ref="formRefDialog" :model="dialogModel" :rules="dialogRules" :label-col="labelCol" class="flex flex-1">
      <a-card :title="$t('page.database.titleDataMapping')" :bordered="false" class="flex flex-col flex-1">
        <div class="flex flex-col h-full flex-1">
          <a-row :gutter="[16, 16]" class="mb-4">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.database.connectionID')" name="connectionID" class="m-0">
                <a-select v-model:value="dialogModel.connectionID" :placeholder="$t('page.database.form.connectionID')" :options="connectionOptions" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.database.dataObjectType')" name="dataObjectType" class="m-0">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <a-select v-model:value="dialogModel.dataObjectType" :placeholder="$t('page.database.form.dataObjectType')" :options="translateOptions(dataObjectTypeOptions)" class="flex-1" />
                  <a-button type="primary" class="orange-btn ml-3" @click="showDataObjectModal()">{{$t('page.database.addMapping')}}</a-button>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <div class="flex-grow min-h-0 diagram-container">
            <RelationDiagram ref="relationDiagramRef" />
          </div>
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
    <DataObjectModal v-model:visible="dataObjectModalVisible" :connection-id="dialogModel.connectionID" :data-object-type="dialogModel.dataObjectType" :selected-data-object-names="selectedDataObjectNames" @delete="handleDelete" @add="handleAdd" />
    <DataHandleModal v-model:visible="dataHandleModalVisible" :programme-language="model.taskDatabase.dataHandleLanguage" @confirm="handleConfirm" />
  </div>
</template>

<style scoped>
  .flex-1 {flex: 1 !important; }
  .monaco-editor-btn { margin-bottom: 16px; }
  .diagram-container { background-color: #fCfCfC; border: #ECF0F1 1px solid; position: relative; }
  ::v-deep .ant-card .ant-card-body { height: 100%; flex: 1; box-sizing: border-box; overflow: hidden; }
</style>
