<script setup lang="ts">
import { $t, language } from '@/locales';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { onMounted, computed, ref, watch } from 'vue';
import DataObjectModal from './modules/data-object-modal.vue';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { convertOptions, translateOptions } from '@/utils/common';
import { fetchGetConnectionOptions } from '@/service/api/connection';
import RelationDiagram from '@/components/pages/relation-diagram.vue';
import { fetchCheckName, fetchSave, fetchGetModel, fetchGetData } from '@/service/api/task-database';
import { booleanYesOrNoOptions, dataHandleOptions, runModeOptions, dataObjectTypeOptions } from '@/constants/task';

// 1. 参数定义
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();
const { formRef } = useAntdForm();
const { defaultRequiredRule } = useFormRules();
const relationDiagramRef =  ref<InstanceType<typeof RelationDiagram>>();

const connectionOptions = ref<{ label: string; value: number }[]>([]);
const modalVisible = ref(false);
const operateType = ref<'add' | 'edit'>('add');

const model = ref<Api.Task.TaskDatabaseModel>(createDefaultModel());
const dataSource = ref<any[]>([]);
const selectedDataObjectNames = ref<[]>;

// 根据语言动态设置 labelCol 宽度
const labelCol = language() === 'en-US' ?  { style: { width: '130px' } } :  { style: { width: '100px' } };

// #region 3. 定义默认模型
function createDefaultModel(): Api.Task.TaskDatabaseModel {
  return {
    id: 0,
    taskType: '5000',
    taskName: '',
    runMode: '6000',
    runFrequency: '',
    runTime: '',
    dataHandle: 0, // 新增（根据 DataHandle 类型应为 0 或 1）
    programmeLanguage: '7000',
    dataHandleScript: '',
    isDebug: false,
    status: 0,
    description: '',
    createUserID: 0,
    createTime: '',
    taskID: 0,
    connectionID: undefined,
    dataObjectType: 'table',
    dataMapping: ''
  }
}
//#endregion

// #region 4. 定义规则类型 验证表单
type RuleKey = Extract<keyof Api.Task.TaskDatabaseModel, 'taskType' | 'taskName' | 'runMode' | 'runFrequency' | 'runTime' | 'dataHandle' | 'programmeLanguage' | 'dataHandleScript' | 'isDebug' | 'status' | 'connectionID' | 'dataObjectType' | 'dataMapping'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  return {
    taskType: defaultRequiredRule,
    taskName: defaultRequiredRule,
    runMode: defaultRequiredRule,
    runFrequency: defaultRequiredRule,
    runTime: {
      required: model.value.runMode !== '6000',
      validateTrigger: 'blur',
      validator: async (rule, value, callback) => {
        if (model.value.runMode !== '6000' && !value) {
          callback('当 runMode 不为 6000 时，runTime 为必填项');
        } else {
          callback();
        }
      }
    },
    dataHandle: defaultRequiredRule,
    programmeLanguage: defaultRequiredRule,
    dataHandleScript: defaultRequiredRule,
    isDebug: defaultRequiredRule,
    status: defaultRequiredRule,
    connectionID: defaultRequiredRule,
    dataObjectType: defaultRequiredRule,
    dataMapping: defaultRequiredRule
  };
});
// #endregion

// 初始化时
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
    const { response } = await fetchGetModel(id);
    const data = response.data as { code: string; msg: string; data: Api.Task.TaskDatabaseModel };
    model.value = (data?.data && Object.keys(data.data).length > 0) ? data.data as Api.Task.TaskDatabaseModel : createDefaultModel();
  }

  // 获取表格数据
  dataSource.value = await fetchGetData();
});

// 保存数据对象
async function handleSave() {
  // formRef.value?.validate().then(async () => {
  //   const { response } = await fetchSave(model.value);
  //   const data = response.data as { code: string; msg: string; data: string};
  //   if (data.msg === "fail") {
  //     window.$message?.error(data.data);
  //   } else if (data.msg === "success") {
  //     window.$message?.success($t('common.addSuccess'));
  //     appStore.tabStore.removeActiveTab();
  //     router.push({ name: 'database' });
  //   }
  // }).catch(() => {
  //   return;
  // });
}

// 显示数据对象模态框
function showDataObjectModal() {
   formRef.value?.validate(['connectionID', 'dataObjectType']).then(() => {
    selectedDataObjectNames.value = relationDiagramRef.value?.getDataObjectNames() || [];
    modalVisible.value = true;
  })
}

// 返回数据库列表
function handleBack() {
  appStore.tabStore.removeActiveTab();
  router.push({ name: 'database' });
}

// isDebug 计算属性，用于在 Select 组件中绑定 'true'/'false' 字符串值
const booleanYesOrNoValue = computed({
  get: () => model.value.isDebug ? 'true' : 'false',
  set: (val: 'true' | 'false') => { model.value.isDebug = val === 'true'; }
});

// 监听 runMode 的变化，动态更新 runTime 的必填规则
watch(() => model.value.runMode, (newRunMode) => {
  if (newRunMode === '6000') {
    rules.value.runTime.required = false;
  } else {
    rules.value.runTime.required = true;
  }
});

// 监听语言变化，动态更新 labelCol 的宽度
watch(language, (newLang) => {
  labelCol.style.width = newLang === 'en-US' ? '130px' : '100px';
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch overflow-hidden lt-sm:overflow-auto pr-3">
    <a-form ref="formRef" :model="model" :rules="rules" :label-col="labelCol">
      <a-card :title="$t('page.database.titleBaseInfo')" :bordered="false" class="card-wrapper">
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.taskName')" name="taskName" class="m-0">
                <a-input v-model:value="model.taskName" :placeholder="$t('page.task.form.taskName')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.isDebug')" name="isDebug" class="m-0">
                <a-select v-model:value="booleanYesOrNoValue" :placeholder="$t('page.task.form.isDebug')" :options="translateOptions(booleanYesOrNoOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runMode')" name="runMode" class="m-0">
                <a-select v-model:value="model.runMode" :placeholder="$t('page.task.form.runMode')" :options="translateOptions(runModeOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runTime')" name="runTime" class="m-0">
                <a-date-picker v-model:value="model.runTime" show-time :placeholder="$t('page.task.runTime')" style="width: 100%;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.description')" name="description" class="m-0">
                <a-input v-model:value="model.description" :placeholder="$t('page.task.form.description')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.dataHandle')" name="dataHandle" class="m-0">
                <a-select v-model:value="model.dataHandle" :placeholder="$t('page.task.form.dataHandle')" :options="convertOptions(dataHandleOptions)" />
              </a-form-item>
            </a-col>
          </a-row>
      </a-card>
      <a-card :title="$t('page.database.titleDataMapping')" :bordered="false" class="card-wrapper mt-4">
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.database.connectionID')" name="connectionID" class="m-0">
                <a-select v-model:value="model.connectionID" :placeholder="$t('page.database.form.connectionID')" :options="connectionOptions" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.database.dataObjectType')" name="dataObjectType" class="m-0">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <a-select v-model:value="model.dataObjectType" :placeholder="$t('page.database.form.dataObjectType')" :options="translateOptions(dataObjectTypeOptions)" class="flex-1" />
                  <a-button type="primary" class="orange-btn ml-3" @click="showDataObjectModal()">{{$t('common.add')}}</a-button>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="24" :lg="24" class="mt-4 pr-0">
              <RelationDiagram ref="relationDiagramRef" :data-source="dataSource" />
            </a-col>
            <a-col :span="24" :md="24" :lg="24" class="bottom-button">
              <a-button type="primary" @click="handleSave" class="blue-btn mr-8 pl-6">
                {{$t('common.save')}}
              </a-button>
              <a-button type="primary" @click="handleBack" ghost class=" pl-6 pr-6">
                {{$t('common.back')}}
              </a-button>
            </a-col>
          </a-row>
      </a-card>
    </a-form>
    <DataObjectModal v-model:visible="modalVisible" :connection-id="model.connectionID" :data-object-type="model.dataObjectType" :selected-table-names="selectedDataObjectNames" />
  </div>
</template>

<style scoped>
  .flex-1 {flex: 1; }
  .bottom-button { text-align: center; padding-top: 15px; }
</style>
