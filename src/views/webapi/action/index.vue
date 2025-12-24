<script lang="ts" setup>
  import { $t, language } from '@/locales';
  import { ref, computed } from 'vue';
  import type { TableColumnsType } from 'ant-design-vue';
  import WebApiModal from './modules/webapi-modal.vue';
  import { convertOptions, translateOptions, convertDateTime } from '@/utils/common';
  import { booleanYesOrNoOptions, dataHandleOptions, runModeOptions,taskStatusOptions, programmeLanguageOptions } from '@/constants/options';

  const columns: TableColumnsType<Api.Task.TaskWebApi> = [
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
      width: 100
    },
    {
      key: 'method',
      dataIndex: 'method',
      title: $t('page.webApi.method'),
      align: 'center',
      width: 100
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
  ];

  // 参数定义
  const webApiModalVisible = ref(false);

  // 根据语言动态设置 labelCol 宽度
  const labelCol = language() === 'en-US' ?  { style: { width: '141px' } } :  { style: { width: '100px' } };

  // 定义默认模型
  const model = ref<Api.Task.TaskWebApiModel>(createDefaultModel());
  const itemModel = ref<Api.Task.TaskWebApi[]>([]);

  const runTimeValue = computed<string | undefined>({
    get: () => convertDateTime(model.value.task.runTime),
    set: value => {
        model.value.task.runTime = convertDateTime(value);
    }
  });

  function createDefaultModel(): Api.Task.TaskWebApiModel {
    const task = createTaskModel();
    const taskWebApi = createWebApiModel();
    return {
      task: task,
      taskWebApi: taskWebApi
    };
  }

  function createTaskModel(): Api.Task.TaskModel {
    return {
      id: 0,
      taskType: '5000',
      taskName: '',
      runMode: '6000',
      runFrequency: 0,
      runTime: undefined,
      dataHandle: 0,
      programmeLanguage: '7000',
      dataHandleScript: '',
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
      authorizeID: 0,
      method: 'GET',
      requestUrl: '',
      timeOut: 0,
      queryParameters: '',
      requestBodyType: '',
      requestBodyContent: '',
      headers: '',
      tokenPassBy: 0,
      tokenPrefix: '',
      responseBodyType: '',
      responseBodyContent: '',
      judgeMode: 0,
      jdgeCondition: '',
      handleCallResult: '',
      dataMapping: '',
      diagramData: '',
      shareVariables: ''
    };
  }

  // #region 11. isDebug 计算属性，用于在 Select 组件中绑定 'true'/'false' 字符串值
  const booleanYesOrNoValue = computed({
    get: () => model.value.task.isDebug ? 'true' : 'false',
    set: (val: 'true' | 'false') => { model.value.task.isDebug = val === 'true'; }
  });
  // #endregion

  // #region 3. 添加API请求
  function addRow () {
    webApiModalVisible.value = true;
    // const newItem = createWebApiModel();
    // newItem.id = itemModel.value.length + 1;
    // itemModel.value.unshift(newItem);
  }
  // #endregion

  // #region 3. 删除API请求
  function handleDelete(id: number) {
    const index = itemModel.value.findIndex(item => item.id === id);
    if (index !== -1) {
      itemModel.value.splice(index, 1);
    }
  }
  // #endregion

  // #region 5. 处理DataHandleModal返回的内容
  function handleConfirm(content: string) {
    webApiModalVisible.value = false;
  }
// #endregion
  // #region 3. 初始化时
  // onMounted(async () => {
  //   const id = Number(route.query.id ?? 0);
  //   if (id) {
  //     const { error, data } = await AuthorizeApi.fetchGetModel(id);
  //     if (!error && data) {
  //       model.value = { ...createDefaultModel(), ...data };
  //     }
  //   }
  // });
  // #endregion
</script>

<!-- App.vue -->
<template>
  <div class="min-h-500px flex flex-col h-full lt-sm:overflow-auto pr-3">
    <a-form ref="formRefTask" :model="model.task"  :label-col="labelCol" class="flex flex-col">
      <a-card :title="$t('page.database.titleBaseInfo')" :bordered="false" class="mb-4">
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.taskName')" name="taskName" class="m-0">
                <a-input v-model:value="model.task.taskName" :placeholder="$t('page.task.form.taskName')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.isDebug')" name="isDebug" class="m-0">
                <a-select v-model:value="booleanYesOrNoValue" :placeholder="$t('page.task.form.isDebug')" :options="translateOptions(booleanYesOrNoOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runMode')" name="runMode" class="m-0">
                <a-select v-model:value="model.task.runMode" :placeholder="$t('page.task.form.runMode')" :options="translateOptions(runModeOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runTime')" name="runTime" class="m-0">
                <a-date-picker v-model:value="runTimeValue" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"show-time :placeholder="$t('page.task.runTime')" style="width: 100%;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.programmeLanguage')" name="programmeLanguage" class="m-0">
                <a-select v-model:value="model.task.programmeLanguage" :placeholder="$t('page.task.form.programmeLanguage')" :options="programmeLanguageOptions" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.status')" name="status" class="m-0">
                <a-select v-model:value="model.task.status" :placeholder="$t('page.task.form.status')" :options="convertOptions(taskStatusOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.dataHandle')" name="dataHandle" class="m-0">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <a-select v-model:value="model.task.dataHandle" :placeholder="$t('page.task.form.dataHandle')" :options="convertOptions(dataHandleOptions)" class="flex-1" />
                  <a-button type="primary" class="bule-btn ml-3">{{$t('page.task.dataHandle')}}</a-button>
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
        <a-table ref="tableRef" :data-source="itemModel" :columns="columns" :pagination="false" row-key="id">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operate'">
                <div class="flex-center gap-8px">
                  <a-button type="default" :class="`orange-btn row-btn ${language() === 'en-US' ? 'en-edit' : ''}`">
                    <icon-mdi-square-edit-outline class="align-sub text-16px" />
                    <span>{{ $t('common.edit') }}</span>
                  </a-button>
                  <a-popconfirm :title="$t('common.confirmDelete')" @confirm="handleDelete(record.id)">
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
    </a-form>
    <WebApiModal v-model:visible="webApiModalVisible" @confirm="handleConfirm" />
  </div>
</template>

<style scoped>
</style>
