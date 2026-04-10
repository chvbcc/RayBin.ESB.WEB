<script lang="tsx" setup>
  import { $t, language } from '@/locales';
  import { useRoute, useRouter } from 'vue-router';
  import { useAntdForm } from '@/hooks/common/form';
  import { useAppStore } from '@/store/modules/app';
  import { useAuthStore } from '@/store/modules/auth';
  import { ref, onMounted, computed, watch } from 'vue';
  import type { TableColumnsType } from 'ant-design-vue';
  import NodeBrowseModal from './modules/node-browse.vue';
  import { fetchSave, fetchGetConnectionOptions, fetchGetModel } from '@/service/api/industria';
  import { convertOptions, getPromptMessage } from '@/utils/common';
  import { industriaApiInterfaceTypeOptions, taskStatusOptions } from '@/constants/options';

  // #region 01. 表格列
  const columns = computed<TableColumnsType<Api.Industria.IndustriaApiDetail>>(() => [
    {
      key: 'nodeName',
      dataIndex: 'nodeName',
      title: $t('page.industriaApiDetail.nodeName'),
      minWidth: 200,
      align: 'left'
    },
    {
      key: 'nodeID',
      dataIndex: 'nodeID',
      title: $t('page.industriaApiDetail.nodeID'),
      minWidth: 200,
      align: 'left'
    },
    {
      key: 'nodeClass',
      dataIndex: 'nodeClass',
      title: $t('page.industriaApiDetail.nodeClass'),
      align: 'left',
      minWidth: 150,
    },
    {
      key: 'variableName',
      dataIndex: 'variableName',
      title: $t('page.industriaApiDetail.variableName'),
      align: 'center',
      width: 200
    },
    {
      key: 'attributeName',
      dataIndex: 'attributeName',
      title: $t('page.industriaApiDetail.attributeName'),
      align: 'left',
      minWidth: 150,
    },
    {
      key: 'dataType',
      dataIndex: 'dataType',
      title: $t('page.industriaApiDetail.dataType'),
      align: 'left',
      minWidth: 150,
    }
  ]);
  // #endregion

  // #region 02. 参数定义
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const nodeBrowseModalVisible = ref(false);
  const { formRef } = useAntdForm();
  const connectionOptions = ref<{ label: string; value: number }[]>([]);

  // 根据语言动态设置 labelCol 宽度
  const labelCol = computed(() => language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } });

  // 定义默认模型
  const model = ref<Api.Industria.IndustriaApiModel>(createDefaultModel());
  // #endregion

  // #region 03. 创建默认模型
  function createDefaultModel(): Api.Industria.IndustriaApiModel {
    return {
      industriaApi: createApiModel(),
      industriaApiDetail: [],
      deleteIndustriaIds: []
    };
  }

  function createApiModel(): Api.Industria.ApiModel {
    return {
      id: 0,
      interfaceName: '',
      connectionID: undefined,
      interfaceType: 0,
      description: '',
      status: 0
    };
  }

  function createApiDetailModel(): Api.Industria.ApiDetailModel {
    return {
      id: 0,
      industriaApiID: 0,
      nodeName: '',
      nodeID: '',
      nodeClass: '',
      variableName: '',
      value: '',
      builtInType: '',
      attributeName: '',
      dataType: '',
      description: ''
    };
  }
  // #endregion

  async function handleAdd() {
    const newDetail = createApiDetailModel();
    await formRef.value?.validateFields([['industriaApi', 'connectionID']]).then(async () => {
      nodeBrowseModalVisible.value = true;
      return true;
    }).catch(() => {
      return false;
    });
    //model.value.industriaApiDetail.push(newDetail);

  }

  function handleEdit(id: number) {
    // 编辑逻辑
  }

  function handleDelete(id: number) {
    // 删除逻辑
  }

  function handleNodeSelect(nodeData: any) {
    // 处理选中的节点数据
    console.log('Selected node:', nodeData);
    // 可以将节点数据添加到 industriaApiDetail 中
    const newDetail = createApiDetailModel();
    newDetail.nodeName = nodeData.displayName;
    newDetail.nodeID = nodeData.nodeId;
    newDetail.nodeClass = nodeData.nodeClass;
    model.value.industriaApiDetail.push(newDetail);
  }
  // // #region 04. 表单验证规则
  // const taskNameRule: App.Global.FormRule = {
  //   required: true, // 添加 required: true，确保显示星号
  //   validateTrigger: ['change', 'blur'],
  //   validator: async (_rule: any, value: string) => {
  //     const name = (value ?? '').trim();
  //     if (!name) {
  //       return Promise.reject(new Error(($t('page.task.form.taskName') as string)));
  //     }
  //     const createUserId = parseInt(authStore.userInfo.userId) ?? 0;
  //     const { error, data } = await TaskDataMonitorApi.fetchCheckName(name, createUserId, taskModel.value?.id ?? 0);
  //     if (!error && data) {
  //       return Promise.reject(new Error($t('common.exists')));
  //     }
  //     return Promise.resolve();
  //   }
  // };
  // //#endregion


  // // #region 09. 确认用户对话框
  // function handleConfirm(data: { selectedUsers: { userId: number, userName: string }[] }) {
  //   // 处理确认返回的数据
  //   selectedUsers.value = data.selectedUsers; // 更新本地存储的选中用户
  //   selectedUserIds .value = data.selectedUsers.map(user => user.userId); // 更新本地存储的用户ID
  //   dataMonitorModel.value.messageRecipient = data.selectedUsers.map(user => user.userName).join(', '); // 显示员工姓名（逗号分隔）
  //   messageRecipientModalVisible.value = false; // 关闭模态框
  // }
  // //#endregion

  // #region 12. 保存数据对象
  //   async function handleSave() {
  //     const taskValidate = formRefTask.value?.validate();
  //     const dataMonitorValidate = formRefDataMonitor.value?.validate();
  //     Promise.all([taskValidate, dataMonitorValidate]).then(async () => {
  //       // 处理 runTime
  //       taskModel.value.runTime = undefined;

  //       // 处理判断条件
  //       const allValuesEmpty = dataMonitorModel.value.conditions.every(condition => {
  //         const value = condition.value;
  //         if (value === null || value === undefined) return true;
  //         return String(value).trim() === '';
  //       });
  //       if (allValuesEmpty) taskModel.value.status = 1;

  //       // 将 messageRecipient 转换为 JSON 格式
  //       const messageRecipientJson = convertMessageRecipientToJson(dataMonitorModel.value.messageRecipient);

  //       const payload: Api.Task.TaskDataMonitorModel = {
  //         task: { ...taskModel.value },
  //         taskDataMonitor: {
  //           ...dataMonitorModel.value,
  //           messageRecipient: messageRecipientJson
  //         }
  //       };

  //     // 提交保存
  //     const { error, response } = await TaskDataMonitorApi.fetchSave(payload);
  //     if (error) { window.$message?.error(getPromptMessage(route.query, "Failed")); return; }
  //     const result = response.data as { code: string; msg: string; data: string };
  //     if (result.msg === 'success') {
  //       window.$message?.success(getPromptMessage(route.query, "Success"));
  //       appStore.tabStore.removeActiveTab();
  //       router.push({ name: 'monitor' });
  //     } else if (result.msg === 'fail') {
  //       window.$message?.error(result.data);
  //     } else {
  //       window.$message?.error(getPromptMessage(route.query, "Failed"));
  //     }
  //   }).catch(() => {
  //     return;
  //   });
  // }
  // #endregion

  // #region 13. 返回列表
  function handleBack() {
    appStore.tabStore.removeActiveTab();
    router.push({ name: 'industria_api_default' });
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
        const { error, data } = await fetchGetModel(id);
        if (!error && data) {
          model.value = data;
      }
    } else {
      model.value = createDefaultModel();
    }
  });
  // #endregion
</script>

<!-- App.vue -->
<template>
  <div class="min-h-500px flex flex-col h-full lt-sm:overflow-auto pr-3">
    <a-form ref="formRef" :model="model" :label-col="labelCol" class="flex flex-col">
      <a-card :title="$t('page.database.titleBaseInfo')" :bordered="false" class="mb-4">
        <a-row :gutter="[16, 16]">
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.industriaApi.interfaceName')" :name="['industriaApi', 'interfaceName']" :rules="[{ required: true }]" class="m-0">
              <a-input v-model:value="model.industriaApi.interfaceName" :placeholder="$t('page.industriaApi.form.interfaceName')" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.industriaApi.connectionID')" :name="['industriaApi', 'connectionID']" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="model.industriaApi.connectionID" :placeholder="$t('page.industriaApi.form.connectionID')" :options="connectionOptions"  />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.industriaApi.interfaceType')" :name="['industriaApi', 'interfaceType']" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="model.industriaApi.interfaceType" :placeholder="$t('page.industriaApi.form.interfaceType')" :options="convertOptions(industriaApiInterfaceTypeOptions)" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.industriaApi.status')" :name="['industriaApi', 'status']" :rules="[{ required: true }]" class="m-0">
              <a-select v-model:value="model.industriaApi.status" :placeholder="$t('page.industriaApi.form.status')" :options="convertOptions(taskStatusOptions)" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.industriaApi.description')" :name="['industriaApi', 'description']" class="m-0">
              <a-input v-model:value="model.industriaApi.description" :placeholder="$t('page.industriaApi.form.description')" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card :title="$t('page.industriaApiDetail.title')" class="mb-4">
        <template #extra>
            <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
            <slot name="prefix"></slot>
            <slot name="default">
              <a-button type="primary" ghost @click="handleAdd()">
                <template #icon>
                  <icon-ic-round-plus class="align-sub text-icon" />
                </template>
                <span class="ml-5px">{{ $t('common.add') }}</span>
              </a-button>
            </slot>
            <a-button type="primary" ghost @click="">
              <template #icon>
                <icon-mdi-refresh class="align-sub text-icon" />
              </template>
              <span class="ml-0px">{{ $t('common.refresh') }}</span>
            </a-button>
          </div>
        </template>
        <a-table ref="tableRef" :data-source="model.industriaApiDetail" :columns="columns" :pagination="false" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operate'">
              <div class="flex-center gap-8px">
                <a-button type="default" :class="`orange-btn row-btn ${language() === 'en-US' ? 'en-edit' : ''}`" @click="handleEdit(record.id)">
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
      <a-row :gutter="[16, 16]" class="mt-4 text-align-center">
        <a-col :span="24" :md="24" :lg="24">
          <a-button type="primary" @click="" class="blue-btn mr-8 pl-6 pr-6">
            {{$t('common.save')}}
          </a-button>
          <a-button type="primary" @click="handleBack" ghost class=" pl-6 pr-6">
            {{$t('common.back')}}
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    <NodeBrowseModal v-model:model="model.industriaApiDetail" v-model:visible="nodeBrowseModalVisible"  :connectionID="model.industriaApi.connectionID" @confirm="handleNodeSelect"  />
  </div>
</template>

<style scoped>
</style>
