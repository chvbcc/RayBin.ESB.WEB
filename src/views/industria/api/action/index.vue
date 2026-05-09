<script lang="tsx" setup>
  import { $t, language } from '@/locales';
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAntdForm } from '@/hooks/common/form';
  import { useAppStore } from '@/store/modules/app';
  import { useAuthStore } from '@/store/modules/auth';
  import type { TableColumnsType } from 'ant-design-vue';
  import NodeBrowseModal from './modules/node-browse.vue';
  import { convertOptions, getPromptMessage } from '@/utils/common';
  import { industriaApiInterfaceTypeOptions, taskStatusOptions } from '@/constants/options';
  import { fetchGetConnectionOptions, fetchGetModel, fetchCheckName, fetchSave } from '@/service/api/industria';


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
    },
    {
      key: 'operate',
      dataIndex: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 190,
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
  const editingDetailId = ref<number | null>(null);
  const editingDetail = ref<Api.Industria.ApiDetailModel | null>(null);

  // 根据语言动态设置 labelCol 宽度
  const labelCol = computed(() => language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } });

  // 定义默认模型
  const model = ref<Api.Industria.IndustriaApiModel>(createDefaultModel());
  // #endregion

  // #region 03. 创建默认模型
  function createDefaultModel(): Api.Industria.IndustriaApiModel {
    return {
      industriaApi: createApiModel(),
      industriaApiDetails: [],
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
      dataType: 0,
      description: ''
    };
  }
  // #endregion

  // #region 04. 表单验证规则
  const interfaceNameRule: App.Global.FormRule = {
    required: true, // 添加 required: true，确保显示星号
    validateTrigger: ['change', 'blur'],
    validator: async (_rule: any, value: string) => {
      const name = (value ?? '').trim();
      if (!name) {
        return Promise.reject(new Error(($t('page.industriaApi.form.interfaceName') as string)));
      }
      const createUserId = parseInt(authStore.userInfo.userId) ?? 0;
      const { error, data } = await fetchCheckName(name, createUserId, model.value?.industriaApi.id ?? 0);
      if (!error && data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    }
  };
  //#endregion
  // #region 05. 添加节点明细
  async function handleAdd() {
    await formRef.value?.validateFields([['industriaApi', 'connectionID']]).then(async () => {
      editingDetailId.value = null;
      editingDetail.value = null;
      nodeBrowseModalVisible.value = true;
      return true;
    }).catch(() => {
      return false;
    });
  }
  // #endregion

  // #region 06. 编辑节点明细
  function handleEdit(id: number) {
    const detail = model.value.industriaApiDetails.find(item => item.id === id);
    if (!detail) return;
    editingDetailId.value = id;
    editingDetail.value = { ...detail };
    nodeBrowseModalVisible.value = true;
  }
  // #endregion

  // #region 07. 删除节点明细
  function handleDelete(id: number) {
    const deleteIndex = model.value.industriaApiDetails.findIndex(item => item.id === id);
    if (deleteIndex < 0) return;
    const deletingItem = model.value.industriaApiDetails[deleteIndex];
    // 仅记录后端已存在的明细ID，避免把前端临时新增行ID提交到删除列表
    if (deletingItem.industriaApiID > 0 && deletingItem.id > 0 && !model.value.deleteIndustriaIds.includes(deletingItem.id)) {
      model.value.deleteIndustriaIds.push(deletingItem.id);
    }
    model.value.industriaApiDetails.splice(deleteIndex, 1);
    if (editingDetailId.value === id) {
      editingDetailId.value = null;
      editingDetail.value = null;
    }
  }
  // #endregion

  // #region 08. 获取下一个明细ID
  function getNextDetailId() {
    // 前端临时 ID 使用负数，避免与后端已有正 ID 冲突（后端可据此区分新增/更新）
    const minId = model.value.industriaApiDetails.reduce((min, item) => Math.min(min, item.id ?? 0), 0);
    return minId <= 0 ? minId - 1 : -1;
  }
  // #endregion

  // #region 09. 标准化明细数据
  function normalizeDetail(detail: Partial<Api.Industria.ApiDetailModel>) {
    const normalized = createApiDetailModel();
    normalized.id = detail.id ?? 0;
    normalized.industriaApiID = detail.industriaApiID ?? 0;
    normalized.nodeName = detail.nodeName || detail.variableName || '';
    normalized.nodeID = detail.nodeID || '';
    normalized.nodeClass = detail.nodeClass || '';
    normalized.variableName = detail.variableName || detail.nodeName || '';
    normalized.value = detail.value || '';
    normalized.builtInType = detail.builtInType || '';
    normalized.attributeName = detail.attributeName || '';
    normalized.dataType = detail.dataType || 0;
    normalized.description = detail.description || '';
    return normalized;
  }
  // #endregion

  // #region 10. 选择节点
  function handleNodeSelect(nodeData: Partial<Api.Industria.ApiDetailModel>) {
    const detail = normalizeDetail(nodeData);

    if (editingDetailId.value !== null) {
      const editIndex = model.value.industriaApiDetails.findIndex(item => item.id === editingDetailId.value);
      if (editIndex > -1) {
        detail.id = editingDetailId.value;
        model.value.industriaApiDetails.splice(editIndex, 1, detail);
      }
    } else {
      detail.id = detail.id > 0 ? detail.id : getNextDetailId();
      model.value.industriaApiDetails.push(detail);
    }

    editingDetailId.value = null;
    editingDetail.value = null;
  }
  // #endregion

  // #region 11. 保存数据对象
  async function handleSave() {
    if (model.value?.industriaApiDetails.length == 0) model.value.industriaApi.status = 1;
    formRef.value?.validate().then(async () => {
      const payload: Api.Industria.IndustriaApiModel = {
        industriaApi: { ...model.value.industriaApi },
        industriaApiDetails: model.value.industriaApiDetails,
        deleteIndustriaIds: model.value.deleteIndustriaIds
      };
      // 提交保存
      const { error, response } = await fetchSave(payload);
      if (error) { window.$message?.error(getPromptMessage(route.query, "Failed")); return false; }
      const result = response.data as { code: string; msg: string; data: string };
      if (result.msg === 'success') {
        window.$message?.success(getPromptMessage(route.query, "Success"));
        appStore.tabStore.removeActiveTab();
        router.push({ name: 'industria_api_default' });
      } else if (result.msg === 'fail') {
        window.$message?.error(result.data);
      } else {
        window.$message?.error(getPromptMessage(route.query, "Failed"));
      }
    }).catch(() => {
      return false;
    });
  }
  // #endregion

  // #region 12. 返回列表
  function handleBack() {
    appStore.tabStore.removeActiveTab();
    void router.push({ name: 'industria_api_default' });
  }
  // #endregion

  // #region 13. 初始化时
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
            <a-form-item :label="$t('page.industriaApi.interfaceName')" :name="['industriaApi', 'interfaceName']" :rules="interfaceNameRule" class="m-0">
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
      <a-card :title="$t('page.industriaApiDetail.nodeList')" class="mb-4">
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
        <a-table ref="tableRef" :data-source="model.industriaApiDetails" :columns="columns" :pagination="false" row-key="id">
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
          <a-button type="primary" @click="handleSave" class="blue-btn mr-8 pl-6 pr-6">
            {{$t('common.save')}}
          </a-button>
          <a-button type="primary" @click="handleBack" ghost class=" pl-6 pr-6">
            {{$t('common.back')}}
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    <NodeBrowseModal v-model:visible="nodeBrowseModalVisible" :connectionID="model.industriaApi.connectionID"  :edit-data="editingDetail" @confirm="handleNodeSelect" />
  </div>
</template>

<style scoped>
</style>
