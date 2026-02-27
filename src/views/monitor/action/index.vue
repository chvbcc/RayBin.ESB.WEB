<script lang="tsx" setup>
  import { $t, language } from '@/locales';
  import { useRoute, useRouter } from 'vue-router';
  import { useAntdForm } from '@/hooks/common/form';
  import { useAppStore } from '@/store/modules/app';
  import { useAuthStore } from '@/store/modules/auth';
  import { ref, onMounted, computed, watch } from 'vue';
  import type { TableColumnsType } from 'ant-design-vue';
  import MessageRecipientModal from './modules/message-recipient.vue';
  import { fetchGetConnectionOptions } from '@/service/api/connection';
  import { TaskDataMonitorApi, DatabaseSchemaApi } from '@/service/api/task';
  import { convertOptions, translateOptions, getPromptMessage } from '@/utils/common';
  import { booleanYesOrNoOptions, runModeOptions, taskStatusOptions, dataObjectTypeOptions, conditionOperatorOptions, dataRangeOptions, andOrOperatorOptions, messageTypeOptions } from '@/constants/options';

  // #region 01. 表格列
  const columns = computed<TableColumnsType<Api.Task.Condition>>(() => [
    {
      key: 'name',
      dataIndex: 'name',
      title: $t('page.monitor.name'),
      minWidth: 200,
      align: 'left'
    },
    {
      key: 'dataType',
      dataIndex: 'dataType',
      title: $t('page.monitor.dataType'),
      align: 'left',
      minWidth: 150,
    },
    {
      key: 'conditionOperator',
      dataIndex: 'conditionOperator',
      title: $t('page.monitor.conditionOperator'),
      align: 'center',
      width: 200
    },
    {
      key: 'value',
      dataIndex: 'value',
      title: $t('page.monitor.value'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'andOrOperator',
      dataIndex: 'andOrOperator',
      title: $t('page.monitor.andOrOperator'),
      align: 'center',
      width: 200
    }
  ]);
  // #endregion

  // #region 02. 参数定义
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const selectedUserIds  = ref<number[]>([]);
  const messageRecipientModalVisible = ref(false);
  const { formRef: formRefTask } = useAntdForm();
  const { formRef: formRefDataMonitor } = useAntdForm();
  const selectedUsers = ref<{ userId: number, userName: string }[]>([]);
  const connectionOptions = ref<{ label: string; value: number }[]>([]);
  const dataObjectNameOptions = ref<{ label: string; value: string }[]>([]);
  const orderPrimaryKeyOptions = ref<{ label: string; value: string }[]>([]);

  // 根据语言动态设置 labelCol 宽度
  const labelCol = computed(() => language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } });

  // 定义默认模型
  const taskModel = ref<Api.Task.TaskModel>(createTaskModel());
  const dataMonitorModel = ref<Api.Task.TaskDataMonitor>(createDataMonitorModel());
  // #endregion

  // #region 03. 创建默认模型
  function createTaskModel(): Api.Task.TaskModel {
    return {
      id: 0,
      taskType: '5000',
      taskName: '',
      runMode: '6005',
      runWeek: undefined,
      runFrequency: 10,
      runTime: undefined,
      isDebug: false,
      status: 0,
      description: ''
    };
  }

  function createDataMonitorModel(): Api.Task.TaskDataMonitor {
    return {
      id: 0,
      taskID: 0,
      connectionID: undefined,
      dataObjectType: 'table',
      dataObjectName: undefined,
      conditions: [],
      triggerLogic: true,
      orderPrimaryKey: '',
      dataRange: 0,
      customRange: '',
      pushMessageType: undefined,
      messageRecipient: '',
      emailSubject: '',
      messageContent: ''
    };
  }
  // #endregion

  // #region 04. 表单验证规则
  const taskNameRule: App.Global.FormRule = {
    required: true, // 添加 required: true，确保显示星号
    validateTrigger: ['change', 'blur'],
    validator: async (_rule: any, value: string) => {
      const name = (value ?? '').trim();
      if (!name) {
        return Promise.reject(new Error(($t('page.task.form.taskName') as string)));
      }
      const createUserId = parseInt(authStore.userInfo.userId) ?? 0;
      const { error, data } = await TaskDataMonitorApi.fetchCheckName(name, createUserId, taskModel.value?.id ?? 0);
      if (!error && data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    }
  };
  //#endregion

  // #region 05. isDebug 计算属性
  const IsDebugValue = computed({
    get: () => taskModel.value?.isDebug ? 'true' : 'false',
    set: (val: 'true' | 'false') => { if (taskModel.value) taskModel.value.isDebug = val === 'true'; }
  });

  const TriggerLogicValue = computed({
    get: () => dataMonitorModel.value?.triggerLogic ? 'true' : 'false',
    set: (val: 'true' | 'false') => { if (dataMonitorModel.value) dataMonitorModel.value.triggerLogic = val === 'true'; }
  });

  const selectedUsersOptions = computed(() =>
    selectedUsers.value.map(user => ({
      label: user.userName,
      value: user.userId
    }))
  );
  // #endregion

  // #region 06. 获取表或视图、存储过程的名称
  async function getDataObjectList() {
    if (!dataMonitorModel.value.connectionID) { return; }
    const { error, data  } = await DatabaseSchemaApi.fetchGetDataObjectList(dataMonitorModel.value.connectionID, dataMonitorModel.value.dataObjectType);
    if (!error) {
      dataObjectNameOptions.value = data.map((item: string) => ({ label: item, value: item }));
    }
    getConditionList();
  }
  //#endregion

  // #region 07. 获取条件列表 表或视图的列、存储过程的参数
  async function getConditionList() {
    if (!dataMonitorModel.value.connectionID || !dataMonitorModel.value.dataObjectType || !dataMonitorModel.value.dataObjectName) { return; }
    const { error, data  } = await TaskDataMonitorApi.fetchGetConditionList(dataMonitorModel.value.connectionID, dataMonitorModel.value.dataObjectType, dataMonitorModel.value.dataObjectName);
    if (!error) {
      dataMonitorModel.value.conditions = data.map((item: Api.Task.Condition) => ({
        name: item.name,
        value: item.value,
        dataType: item.dataType,
        conditionOperator: item.conditionOperator,
        andOrOperator: item.andOrOperator
      }));
      orderPrimaryKeyOptions.value = data.map((item: Api.Task.Condition) => ({ label: item.name, value: item.name }));
    }
  }
  //#endregion

  // #region 08. 搜索用户
  function handleSearchUser() {
    messageRecipientModalVisible.value = true;
  }
  //#endregion

  // #region 09. 确认用户对话框
  function handleConfirm(data: { selectedUsers: { userId: number, userName: string }[] }) {
    // 处理确认返回的数据
    selectedUsers.value = data.selectedUsers; // 更新本地存储的选中用户
    selectedUserIds .value = data.selectedUsers.map(user => user.userId); // 更新本地存储的用户ID
    dataMonitorModel.value.messageRecipient = data.selectedUsers.map(user => user.userName).join(', '); // 显示员工姓名（逗号分隔）
    messageRecipientModalVisible.value = false; // 关闭模态框
  }
  //#endregion

  // #region 10. 将 messageRecipient 转换为 JSON 格式
  function convertMessageRecipientToJson(messageRecipient: string): string {
    if (!messageRecipient || messageRecipient.trim() === '') {
      return '';
    }
    const userNames = messageRecipient.split(',').map(name => name.trim()).filter(name => name);
    const users = userNames.map((userName, index) => ({
      userId: selectedUserIds.value[index] || 0,
      userName
    }));
    return JSON.stringify(users);
  }
  //#endregion

  // #region 11. 将 JSON 格式转换回逗号分隔的姓名
  function convertJsonToMessageRecipient(jsonString: string): string {
    if (!jsonString || jsonString.trim() === '') {
      return '';
    }
    try {
      const users = JSON.parse(jsonString);
      selectedUserIds.value = users.map((user: { userId: number, userName: string }) => user.userId);
      selectedUsers.value = users;
      return users.map((user: { userId: number, userName: string }) => user.userName).join(', ');
    } catch {
      return jsonString;
    }
  }
  //#endregion

  // #region 12. 保存数据对象
    async function handleSave() {
      const taskValidate = formRefTask.value?.validate();
      const dataMonitorValidate = formRefDataMonitor.value?.validate();
      Promise.all([taskValidate, dataMonitorValidate]).then(async () => {
        // 处理 runTime
        taskModel.value.runTime = undefined;

        // 处理判断条件
        const allValuesEmpty = dataMonitorModel.value.conditions.every(condition => {
          const value = condition.value;
          if (value === null || value === undefined) return true;
          return String(value).trim() === '';
        });
        if (allValuesEmpty) taskModel.value.status = 1;

        // 将 messageRecipient 转换为 JSON 格式
        const messageRecipientJson = convertMessageRecipientToJson(dataMonitorModel.value.messageRecipient);

        const payload: Api.Task.TaskDataMonitorModel = {
          task: { ...taskModel.value },
          taskDataMonitor: {
            ...dataMonitorModel.value,
            messageRecipient: messageRecipientJson
          }
        };

      // 提交保存
      const { error, response } = await TaskDataMonitorApi.fetchSave(payload);
      if (error) { window.$message?.error(getPromptMessage(route.query, "Failed")); return; }
      const result = response.data as { code: string; msg: string; data: string };
      if (result.msg === 'success') {
        window.$message?.success(getPromptMessage(route.query, "Success"));
        appStore.tabStore.removeActiveTab();
        router.push({ name: 'monitor' });
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

  // #region 13. 返回列表
  function handleBack() {
    appStore.tabStore.removeActiveTab();
    router.push({ name: 'monitor' });
  }
  // #endregion

  // #region 14. 初始化时
  onMounted(async () => {
    // 获取连接列表并转换为 options
    const { error: connectionError, data: connectionData  } = await fetchGetConnectionOptions();
    if (!connectionError) {
      connectionOptions.value = connectionData.map(item => ({
        label: item.connectionName,
        value: item.id
      }));
    }
    const id = Number(route.query.id ?? 0);
    if (id) {
      const { error: monitorError, data: monitorData } = await TaskDataMonitorApi.fetchGetModel(id);
      if (!monitorError && monitorData) {
        taskModel.value = monitorData.task;
        dataMonitorModel.value = monitorData.taskDataMonitor;
        getDataObjectList();
        // 将 messageRecipient 从 JSON 格式转换回逗号分隔的姓名
        if (dataMonitorModel.value.messageRecipient) {
          dataMonitorModel.value.messageRecipient = convertJsonToMessageRecipient(dataMonitorModel.value.messageRecipient);
        }

      }
    } else {
      // 新增时，初始化默认模型
      taskModel.value = createTaskModel();
      dataMonitorModel.value = createDataMonitorModel();
    }
  });
  // #endregion

  // #region 15. 处理手动删除的用户
  watch (() => selectedUserIds.value,
    (newUserIds) => {
      selectedUsers.value = selectedUsers.value.filter(user => newUserIds.includes(user.userId));
    },
    { deep: true }
  );
  // #endregion
</script>

<!-- App.vue -->
<template>
  <div class="min-h-500px flex flex-col h-full lt-sm:overflow-auto pr-3">
    <a-form ref="formRefTask" :model="taskModel" :label-col="labelCol" class="flex flex-col">
      <a-card :title="$t('page.database.titleBaseInfo')" :bordered="false" class="mb-4">
        <a-row :gutter="[16, 16]">
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.task.taskName')" name="taskName" :rules="taskNameRule" class="m-0">
              <a-input v-model:value="taskModel.taskName" :placeholder="$t('page.task.form.taskName')" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.task.isDebug')" name="isDebug" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="IsDebugValue" :placeholder="$t('page.task.form.isDebug')" :options="translateOptions(booleanYesOrNoOptions)" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.task.runMode')" name="runMode" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="taskModel.runMode" :placeholder="$t('page.task.form.runMode')" :options="translateOptions(runModeOptions)" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.task.runFrequency')" name="runFrequency" :rules="[{required: true }]" class="m-0">
              <a-input-number v-model:value="taskModel.runFrequency" :min="10" :max="99999" :placeholder="$t('page.task.form.runFrequency')" style="width: 100%;" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.task.status')" name="status" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="taskModel.status" :placeholder="$t('page.task.form.status')" :options="convertOptions(taskStatusOptions)" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.task.description')" name="description" class="m-0">
              <a-input v-model:value="taskModel.description" :placeholder="$t('page.task.form.description')" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
    <a-form ref="formRefDataMonitor" :model="dataMonitorModel" :label-col="labelCol" class="flex flex-col">
      <a-card :title="$t('page.monitor.monitorTitle')" class="mb-4">
        <a-row :gutter="[16, 16]" >
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.monitor.connectionID')" name="connectionID" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="dataMonitorModel.connectionID" :placeholder="$t('page.monitor.form.connectionID')" :options="connectionOptions" allow-clear @change="getDataObjectList()" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.monitor.dataObjectType')" name="dataObjectType" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="dataMonitorModel.dataObjectType" :placeholder="$t('page.monitor.form.dataObjectType')" :options="translateOptions(dataObjectTypeOptions)" @change="getDataObjectList()" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.monitor.dataObjectName')" name="dataObjectName" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="dataMonitorModel.dataObjectName" :placeholder="$t('page.monitor.form.dataObjectName')" :options="dataObjectNameOptions" allow-clear @change="getConditionList()" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.monitor.orderPrimaryKey')" name="orderPrimaryKey" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="dataMonitorModel.orderPrimaryKey" :placeholder="$t('page.monitor.form.orderPrimaryKey')" :options="orderPrimaryKeyOptions" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.monitor.dataRange')" name="dataRange" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="dataMonitorModel.dataRange" :placeholder="$t('page.monitor.form.dataRange')" :options="convertOptions(dataRangeOptions)" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.monitor.customRange')" name="customRange" class="m-0" :rules="[{ required: dataMonitorModel.dataRange === 1}]">
              <a-input v-model:value="dataMonitorModel.customRange" :placeholder="$t('page.monitor.form.customRange')" :disabled="dataMonitorModel.dataRange == 0" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-table :data-source="dataMonitorModel.conditions" :columns="columns" :pagination="false" row-key="index" class="editable-table mt-4">
          <template #bodyCell="{column, record, index }">
            <template v-if="column.dataIndex === 'conditionOperator'">
              <a-form-item :name="['conditions', index, 'conditionOperator']" no-style>
                <a-select v-model:value="record.conditionOperator" :placeholder="$t('page.monitor.form.conditionOperator')" :options="conditionOperatorOptions" style="width: 80px;" />
              </a-form-item>
            </template>
            <template v-else-if="column.dataIndex === 'value'">
              <a-form-item :name="['conditions', index, 'value']" no-style>
                <a-input v-model:value="record.value" :placeholder="$t('page.monitor.form.value')" />
              </a-form-item>
            </template>
            <template v-else-if="column.dataIndex === 'andOrOperator'">
              <a-form-item :name="['conditions', index, 'andOrOperator']" no-style>
                <a-select v-model:value="record.andOrOperator" :placeholder="$t('page.monitor.form.andOrOperator')" :options="andOrOperatorOptions" style="width: 80px;" />
              </a-form-item>
            </template>
          </template>
        </a-table>
      </a-card>
      <a-card :title="$t('page.monitor.messageTitle')" class="mb-4">
        <a-row :gutter="[16, 16]" class="mr16">
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.monitor.pushType')" name="pushMessageType" class="m-0" :rules="[{ required: true}]">
              <a-select v-model:value="dataMonitorModel.pushMessageType" :placeholder="$t('page.monitor.form.pushType')" :options="convertOptions(messageTypeOptions)" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.monitor.messageRecipient')" name="messageRecipient" class="m-0" :rules="[{ required: true }]">
              <div style="display: flex; gap: 8px;">
                <a-select mode="multiple" v-model:value="selectedUserIds" :placeholder="$t('page.monitor.form.messageRecipient')" :options="selectedUsersOptions" style="flex: 1;">
                  <template #dropdownRender>
                    <a-divider style="margin: 4px 0" />
                    <a-button type="text" @click="handleSearchUser" style="width: 100%">
                      {{ $t('common.search') }} {{ $t('page.message.assignUser') }}
                    </a-button>
                  </template>
                </a-select>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.monitor.emailSubject')" name="emailSubject" class="m-0" :rules="[{ required: dataMonitorModel.pushMessageType === 3}]">
              <a-input v-model:value="dataMonitorModel.emailSubject" :placeholder="$t('page.monitor.form.emailSubject')" :disabled="dataMonitorModel.pushMessageType !== 3" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.monitor.triggerLogic')" name="triggerLogic" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="TriggerLogicValue" :placeholder="$t('page.monitor.form.triggerLogic')" :options="translateOptions(booleanYesOrNoOptions)" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="24" :lg="24">
            <a-form-item :label="$t('page.monitor.messageContent')" name="messageContent" class="m-0" :rules="[{ required: true}]">
              <a-textarea ref="messageContentRef" v-model:value="dataMonitorModel.messageContent" :rows="4" />
            </a-form-item>
          </a-col>
        </a-row>
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
    <MessageRecipientModal v-model="messageRecipientModalVisible" :selectedUsers="selectedUsers" @confirm="handleConfirm" />
  </div>
</template>

<style scoped>
  .editable-table :deep(.ant-table-tbody) > tr > td { padding: 8px 8px !important; }
</style>
