<script lang="tsx" setup>
  import { $t, language } from '@/locales';
  import { getWeek } from '@/utils/common';
  import { TaskWebApi } from '@/service/api/task';
  import { useRoute, useRouter } from 'vue-router';
  import { useAppStore } from '@/store/modules/app';
  import { useAntdForm } from '@/hooks/common/form';
  import { useAuthStore } from '@/store/modules/auth';
  import WebApiModal from './modules/webapi-modal.vue';
  import { ref, onMounted, computed, watch } from 'vue';
  import type { TableColumnsType } from 'ant-design-vue';
  import { convertOptions, translateOptions, getPromptMessage } from '@/utils/common';
  import { booleanYesOrNoOptions, runModeOptions, runWeekOptions, taskStatusOptions, interfaceTypeRecord } from '@/constants/options';

  // #region 1. 表格列
  const columns = computed<TableColumnsType<Api.Task.TaskWebApi>>(() => [
    {
      key: 'id',
      dataIndex: 'id',
      title: $t('page.task.id'),
      width: 100,
      align: 'center'
    },
    {
      key: 'interfaceType',
      dataIndex: 'interfaceType',
      title: $t('page.webApi.interfaceType'),
      align: 'center',
      width: 150,
      customRender: ({ record }) => {
        if (record.interfaceType === null) {
          return null;
        }
        const label = $t(interfaceTypeRecord[record.interfaceType]);
        return label;
      }
    },
    {
      key: 'method',
      dataIndex: 'method',
      title: $t('page.webApi.method'),
      align: 'center',
      width: 140
    },
    {
      key: 'requestUrl',
      dataIndex: 'requestUrl',
      title: $t('page.webApi.requestUrl'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 160
    }
  ]);
  // #endregion

  // #region 2. 参数定义
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const webApiModalVisible = ref(false);
  const { formRef: formRefTask } = useAntdForm();

  // 根据语言动态设置 labelCol 宽度
  const labelCol = computed(() => language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } });

  // 定义默认模型
  const model = ref<Api.Task.TaskWebApiModel>(createDefaultModel());
  const currentItemModel = ref<Api.Task.TaskWebApi | undefined>(undefined);
  // #endregion

  // #region 3. 创建默认模型
  function createDefaultModel(): Api.Task.TaskWebApiModel {
    return {
      task: createTaskModel(),
      taskWebApis: [],
      deleteWebApiIds: []
    };
  }

  function createTaskModel(): Api.Task.TaskModel {
    return {
      id: 0,
      taskType: '5000',
      taskName: '',
      runMode: '6000',
      runWeek: undefined,
      runFrequency: 10,
      runTime: undefined,
      isDebug: false,
      status: 0,
      description: ''
    };
  }

  function createWebApiModel(): Api.Task.TaskWebApi {
    return {
      id: 0,
      taskID: 0,
      interfaceType: '8000',
      authorizeID: undefined,
      method: 'GET',
      requestUrl: '',
      timeOut: 180,
      queryParameters: [createParamModel()],
      requestBody: {
        type: 0,
        raw: '',
        formDatas: [createFormDataModel()],
        urlEncodeds: [createParamModel()],
        binaryFilePath: ''
      },
      headers: [createParamModel()],
      tokenPassBy: undefined,
      tokenPrefix: '',
      responseBody: '',
      statusHandleScript: '',
      dataHandle: 0,
      dataHandleLanguage: '7000',
      dataHandleScript: '',
      dataMapping: '',
      diagramData: '',
      shareVariables: ''
    };
  }

  function createFormDataModel(): Api.Task.FormData {
    return {
      name: '',
      value: '',
      isFile: false,
      filePath: '',
      contentType: ''
    };
  }

  function createParamModel(): Api.Task.Param {
    return {
      name: '',
      value: '',
      valueType: 0,
      description: ''
    };
  }
  // #endregion

  const taskNameRule: App.Global.FormRule = {
    required: true, // 添加 required: true，确保显示星号
    validateTrigger: ['change', 'blur'],
    validator: async (_rule: any, value: string) => {
      const name = (value ?? '').trim();
      if (!name) {
        return Promise.reject(new Error(($t('page.task.form.taskName') as string)));
      }
      const createUserId = parseInt(authStore.userInfo.userId) ?? 0;
      const { error, data } = await TaskWebApi.fetchCheckName(name, createUserId, model.value.task.id);
      if (!error && data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    }
  };

  // #region 4. isDebug 计算属性，用于在 Select 组件中绑定 'true'/'false' 字符串值
  const booleanYesOrNoValue = computed({
    get: () => model.value.task.isDebug ? 'true' : 'false',
    set: (val: 'true' | 'false') => { model.value.task.isDebug = val === 'true'; }
  });
  // #endregion

  // #region 5. 添加API请求
  function addRow () {
    currentItemModel.value = createWebApiModel();
    currentItemModel.value.id = 0;
    currentItemModel.value.requestUrl = '';
    currentItemModel.value.responseBody = '';
    currentItemModel.value.diagramData = '';
    webApiModalVisible.value = true;
  }
  // #endregion

  // #region 6. 编辑API请求
  function editRow(record: Api.Task.TaskWebApi) {
    if (!record) return;
    if (record.queryParameters === null || record.queryParameters?.length === 0) {
      record.queryParameters = [createParamModel()];
    }
    if (record.headers === null || record.headers?.length === 0) {
      record.headers = [createParamModel()];
    }
    if (record.authorizeID === 0) {
      record.authorizeID = undefined;
    }
    currentItemModel.value = { ...record }; // 复制对象以避免直接修改
    webApiModalVisible.value = true;
  }

  // #region 7. 删除API请求
  function deleteRow(id: number) {
    if (model.value.taskWebApis) {
      const index = model.value.taskWebApis.findIndex(item => item.id === id);
      if (index !== -1) {
        // 如果task ID 大于 0 为新增
        if (model.value.task.id > 0 && model.value.taskWebApis[index].id > 0) {
          model.value.deleteWebApiIds.push(model.value.taskWebApis[index].id as number);
        }
        // 从数组中移除该项目
        model.value.taskWebApis.splice(index, 1);
      }
    }
  }
  // #endregion

  // #region 8. 处理DataHandleModal返回的内容
  function handleConfirm(record: Api.Task.TaskWebApi) {
    webApiModalVisible.value = false;
    if (record && model.value.taskWebApis) {
      const existingIndex = model.value.taskWebApis.findIndex(item => item.id === record.id);
      if (existingIndex >= 0) {
        // 编辑现有项目 - 更新数组中的项目
        model.value.taskWebApis[existingIndex] = { ...record };
      } else {
        // 新增项目 - 添加到数组开头
        model.value.taskWebApis.unshift(record);
      }
    }
  }
  // #endregion

  // #region 9. 保存数据对象
  async function handleSave() {
    formRefTask.value?.validate().then(async () => {
      model.value.task.runTime = model.value.task.runTime ? model.value.task.runTime.replace(' ', 'T') : undefined;
      const payload: Api.Task.TaskWebApiModel = {
        task: { ...model.value.task },
        taskWebApis: [...model.value.taskWebApis],
        deleteWebApiIds: [...model.value.deleteWebApiIds]
      };
      if (payload.taskWebApis.length === 0) payload.task.status = 1;
      // 提交保存
      const { error, response } = await TaskWebApi.fetchSave(payload);
      if (error) { window.$message?.error(getPromptMessage(route.query, "Failed")); return; }
      const result = response.data as { code: string; msg: string; data: string };
      if (result.msg === 'success') {
        window.$message?.success(getPromptMessage(route.query, "Success"));
        appStore.tabStore.removeActiveTab();
        router.push({ name: 'webapi' });
      } else if (result.msg === 'fail') {
        window.$message?.error(result.data);
      } else {
        window.$message?.error(getPromptMessage(route.query, "Failed"));
      }
    }).catch(() => {
      return;
    });
  }
  // #endregion

  // #region 10. 返回数据库列表
  function handleBack() {
    appStore.tabStore.removeActiveTab();
    router.push({ name: 'webapi' });
  }
  // #endregion

  // #region 11. 初始化时
  onMounted(async () => {
    const id = Number(route.query.id ?? 0);
    if (id) {
      const { error, data } = await TaskWebApi.fetchGetModel(id);
      if (!error && data) {
        model.value = data;
        currentItemModel.value = data.taskWebApi || [];
      }
    } else {
      model.value = createDefaultModel();
    }
  });
  // #endregion

  watch(() => model.value?.task?.runMode, (newVal: Api.Task.RunMode) => {
    switch (newVal) {
      case '6001': // 每日
        model.value.task.runWeek = undefined;
        model.value.task.runTime =  new Date().toISOString().slice(0, 19).replace('T', ' ');
        break;
      case '6002': // 每周
        model.value.task.runWeek = getWeek();
        model.value.task.runTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        break;
      case '6003': // 每月
        model.value.task.runWeek = undefined;
        model.value.task.runTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        break;
      case '6004': // 每年
        model.value.task.runWeek = undefined;
        model.value.task.runTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        break;
      default:     // 手动与定时
        model.value.task.runWeek = undefined;
        model.value.task.runTime = undefined;
        break;
    }
});
</script>

<!-- App.vue -->
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
              <a-form-item :label="$t('page.task.isDebug')" :name="['task','isDebug']" :rules="[{ required: true }]" class="m-0">
                <a-select v-model:value="booleanYesOrNoValue" :placeholder="$t('page.task.form.isDebug')" :options="translateOptions(booleanYesOrNoOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runMode')" :name="['task','runMode']" :rules="[{ required: true }]" class="m-0">
                <a-select v-model:value="model.task.runMode" :placeholder="$t('page.task.form.runMode')" :options="translateOptions(runModeOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runWeek')" :name="['task', 'runWeek']" :rules="[{ required: model.task.runMode === '6002' }]" class="m-0">
                <a-select v-model:value="model.task.runWeek" :placeholder="$t('page.task.form.runWeek')" :options="convertOptions(runWeekOptions)" :disabled="model.task.runMode !== '6002'" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runTime')" :name="['task', 'runTime']" :rules="[{required: model.task.runMode !== '6000' && model.task.runMode !== '6005'}]" class="m-0">
                <a-date-picker v-model:value="model.task.runTime" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"show-time :placeholder="$t('page.task.runTime')" :disabled="model.task.runMode === '6000' || model.task.runMode === '6005'"  style="width: 100%;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runFrequency')" :name="['task', 'runFrequency']" :rules="[{required: model.task.runMode === '6005'}]" class="m-0">
                <a-input-number v-model:value="model.task.runFrequency" :min="10" :max="99999" :placeholder="$t('page.task.form.runFrequency')" :disabled="model.task.runMode !== '6005'" style="width: 100%;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.status')" :name="['task', 'status']" :rules="[{ required: true }]" class="m-0">
                <a-select v-model:value="model.task.status" :placeholder="$t('page.task.form.status')" :options="convertOptions(taskStatusOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.description')" :name="['task', 'description']" class="m-0">
                <a-input v-model:value="model.task.description" :placeholder="$t('page.task.form.description')" />
              </a-form-item>
            </a-col>
          </a-row>
      </a-card>
      <a-card :title="$t('page.webApi.requestList')">
        <template #extra>
            <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
            <slot name="prefix"></slot>
            <slot name="default">
              <a-button type="primary" ghost @click="addRow()">
                <template #icon>
                  <icon-ic-round-plus class="align-sub text-icon" />
                </template>
                <span class="ml-5px">{{ $t('common.add') }}</span>
              </a-button>
            </slot>
          </div>
        </template>
        <a-table ref="tableRef" :data-source="model.taskWebApis" :columns="columns" :pagination="false" row-key="id">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operate'">
                <div class="flex-center gap-8px">
                  <a-button type="default" :class="`orange-btn row-btn ${language() === 'en-US' ? 'en-edit' : ''}`" @click="editRow(record as Api.Task.TaskWebApi)">
                    <icon-mdi-square-edit-outline class="align-sub text-16px" />
                    <span>{{ $t('common.edit') }}</span>
                  </a-button>
                  <a-popconfirm :title="$t('common.confirmDelete')" @confirm="deleteRow(record.id)">
                    <a-button type="default" class="red-btn row-btn">
                      <icon-mdi-trash-can-outline class="align-sub text-16px" />
                      <span>{{ $t('common.delete') }}</span>
                    </a-button>
                  </a-popconfirm>
                </div>
              </template>
            </template>
        </a-table>
      </a-card>
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
    </a-form>
    <WebApiModal v-model:visible="webApiModalVisible" v-model:value="currentItemModel"  @confirm="handleConfirm" />
  </div>
</template>

<style scoped>
</style>
