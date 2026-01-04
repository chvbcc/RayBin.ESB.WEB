<script setup lang="ts">
  import { $t, language } from '@/locales';
  import { TaskWebApi } from '@/service/api/task';
  import { translateOptions } from '@/utils/common';
  import { useAuthStore } from '@/store/modules/auth';
  import { ref, onMounted, computed, watch } from 'vue';
  import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
  import DataObjectModal from './data-object-modal.vue';
  import RequestBody from '@/components/webapi/request/body.vue';
  import { useAntdForm, useFormRules } from '@/hooks/common/form';
  import RequestHeader from '@/components/webapi/request/headers.vue';
  import { fetchGetConnectionOptions } from '@/service/api/connection';
  import RelationDiagram from '@/components/webapi/relation-diagram.vue';
  import QueryParameter from '@/components/webapi/request/parameters.vue';
  import { locationOptions, methodOptions, interfaceTypeOptions, dataObjectTypeOptions } from '@/constants/options';

  // 定义变量 参数 事件
  const authStore = useAuthStore();
  const { defaultRequiredRule } = useFormRules();
  const { formRef: formRefDialog } = useAntdForm();
  const relationDiagramRef =  ref<InstanceType<typeof RelationDiagram>>();

  const authorizeOptions = ref<CommonType.Option[]>([]);
  const authorizeData = ref<Api.Authorize.Authorize[]>([]);
  const emit = defineEmits(['update:visible', 'confirm']);
  const visible = defineModel<boolean>('visible', { default: false });
  const value = defineModel<Api.Task.TaskWebApi>('value', { default: () => ({}) });

  // 根据语言动态设置 labelCol 宽度
  const labelCol = computed(() => language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } });
  const title = computed(() => Number(value.value.id ?? 0) > 0 ? $t('page.webApi.requestEdit') : $t('page.webApi.requestNew'));
  const dataHandleLanguage = computed(() => value.value.dataHandleLanguage === '7000' ? 'csharp' : 'python');

  const dataObjectModalVisible = ref(false);
  const connectionOptions = ref<{ label: string; value: number }[]>([]);
  const dialogModel = ref<Api.Task.DialogModal>({connectionID: undefined, dataObjectType: 'table'});
  const selectedDataObjectNames = ref<string[]>([]);

  type dialogRuleKey = Extract<keyof Api.Task.DialogModal, 'connectionID' | 'dataObjectType'>;
  const dialogRules = computed<Record<dialogRuleKey, App.Global.FormRule>>(() => {
    return {
      connectionID: defaultRequiredRule,
      dataObjectType: defaultRequiredRule,
    };
  });


  // 编辑器选项
  const MONACO_EDITOR_OPTIONS = {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
    theme: "vs",
  }

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
  async function initConnectionOptions() {
    // 获取连接列表并转换为 options
    const { error, data  } = await fetchGetConnectionOptions();
    if (!error) {
      connectionOptions.value = data.map(item => ({
        label: item.connectionName,
        value: item.id
      }));
    }
  }
  async function initAuthorizeOptions() {
    // 获取连接列表并转换为 options
    const userId = Number(authStore.userInfo.userId);
    const { error, data } = await TaskWebApi.fetchGetAuthorizes(userId);
    if (!error) {
      authorizeData.value = data;
      authorizeOptions.value = data.map((item: Api.Authorize.Authorize) => ({
        label: item.name,
        value: item.id
      }));
    }
  }

  function handleAuthorizeChange(authorizeId: number | undefined) {
    if (!authorizeId) return;
    const selectedAuthorize = authorizeData.value.find(item => item.id === authorizeId);
    if (selectedAuthorize) {
      value.value.tokenPassBy = selectedAuthorize.tokenPassBy;
      value.value.tokenPrefix = selectedAuthorize.tokenPrefix;
    }
  }
  //显示数据对象模态框
  function showDataObjectModal() {
    formRefDialog.value?.validate(['connectionID', 'dataObjectType']).then(() => {
      selectedDataObjectNames.value = relationDiagramRef.value?.getDataObjectNames() || [];
      dataObjectModalVisible.value = true;
    })
  }

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
  onMounted(() => {
    initConnectionOptions();
    initAuthorizeOptions();
  });

  // #region 默认代码
  // 监听programmeLanguage变化，更新语言和代码
  const dataHandleCsharpCode = `
    // This C# Code Example
    // Task starts before execution
    private List<dynamic> BeforeStarts(List<dynamic> dynamics, DatabaseAccessor dataHelper)
    {
        // 用户代码
        return dynamics;
    }
    return BeforeStarts(Dynamics, DataHelper);

    // Task ends after execution
    private void AfterEnds(DatabaseAccessor sourceDataHelper, DatabaseAccessor targetDataHelper) {
      // 用户代码
    }
  `
  const dataHandlePythonCode = `
    # Task starts before execution
    def before_starts(dynamics, data_helper, message):
        # 用户代码（可修改 dynamics 并返回新的 List[dynamic]）
        return dynamics

    result = before_starts(dynamics, data_helper, message)

    # Task ends after execution
    def after_ends(source_data_helper, target_data_helper, message):
      # 用户代码
      pass
  `
  // #endregion
  watch(() => value.value.dataHandleLanguage, (newLang) => {
    if (newLang === '7000') {
      value.value.dataHandleScript = dataHandleCsharpCode;
    } else {
      value.value.dataHandleScript = dataHandlePythonCode;
    }
  }, { immediate: true });
</script>

<template>
  <a-modal v-model:open="visible" :title="title" style="width: 90%; height: 80vh">
    <a-form ref="formRef" :model="value" layout="horizontal" class="h-full"  :label-col="labelCol">
      <a-tabs default-active-key="1" class="h-full">
        <a-tab-pane :key="1" :tab="$t('page.webApi.requestInfo')">
          <a-card :title="$t('page.authorize.titleBaseInfo')" :bordered="true" class="mt-1">
            <a-row :gutter="[16, 16]" class="text-align-center">
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.interfaceType')" name="interfaceType" class="m-2">
                  <a-select v-model:value="value.interfaceType" :options="translateOptions(interfaceTypeOptions)" :placeholder="$t('page.webApi.form.interfaceType')" class="w-full"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.method')" name="method" class="m-2">
                  <a-select v-model:value="value.method" :options="methodOptions" :placeholder="$t('page.webApi.form.method')" class="w-full"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.timeOut')" name="timeOut" class="m-2">
                  <a-input-number v-model:value="value.timeOut" class="w-full" :min="0" :placeholder="$t('page.webApi.form.timeOut')" />
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.authorize')" name="authorize" class="m-2">
                  <a-select v-model:value="value.authorize" :options="authorizeOptions" :placeholder="$t('page.webApi.form.authorize')" class="w-full" @change="handleAuthorizeChange(value.authorize)"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.tokenPassBy')" name="tokenPassBy" class="m-2">
                  <a-select v-model:value="value.tokenPassBy" :options="locationOptions" :placeholder="$t('page.webApi.form.tokenPassBy')" class="w-full"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.tokenPrefix')" name="tokenPrefix" class="m-2">
                  <a-input v-model:value="value.tokenPrefix" :placeholder="$t('page.webApi.form.tokenPrefix')" class="w-full"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="24" :lg="24">
                <a-form-item :label="$t('page.webApi.requestUrl')" name="requestUrl" class="m-2">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <a-input v-model:value="value.requestUrl" :placeholder="$t('page.webApi.form.requestUrl')" class="flex-1" />
                  <a-button type="primary" class="bule-btn ml-3">{{$t('page.database.dataHandle')}}</a-button>
                </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card id="requestList" :title="$t('page.webApi.requestBodyContent')" :bordered="true" class="mt-5 mb-2">
            <a-tabs default-active-key="1" class="h-full">
              <a-tab-pane :key="1" :tab="$t('page.webApi.queryParameter')">
                <query-parameter style="height: 360px;" v-model:model="value.queryParameters" />
              </a-tab-pane>
              <a-tab-pane :key="2" :tab="$t('page.webApi.requestBody')">
                <request-body style="height: 360px;" v-model:model="value.requestBody" />
              </a-tab-pane>
              <a-tab-pane :key="3" :tab="$t('page.webApi.headers')">
                <request-header style="height: 360px;" v-model:model="value.headers" />
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :key="2" :tab="$t('page.webApi.responseInfo')">
          <div class="code-box">
            <span>{{$t('page.webApi.responseBodyType')}}： </span>
            <a-radio-group v-model:value="value.responseBodyType">
              <a-radio value="json">json</a-radio>
              <a-radio value="text">text</a-radio>
            </a-radio-group>
            <div class="code">
              <vue-monaco-editor v-model:value="value.responseBodyContent" theme="vs" :options="MONACO_EDITOR_OPTIONS" class="editor" :language="value.responseBodyType" />
            </div>
          </div>
          <div class="code-box mt-5">
            <span>{{$t('page.webApi.dataHandleScript')}}： </span>
            <a-radio-group v-model:value="value.dataHandleLanguage">
              <a-radio value="7000">csharp</a-radio>
              <a-radio value="7001">python</a-radio>
            </a-radio-group>
            <div class="code">
              <vue-monaco-editor v-model:value="value.dataHandleScript" theme="vs" :options="MONACO_EDITOR_OPTIONS" class="editor" :language="dataHandleLanguage" />
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="3" :tab="$t('page.webApi.dataMapping')">
          <a-form ref="formRefDialog" :model="dialogModel" :rules="dialogRules" :label-col="labelCol" class="mb-4">
            <a-row :gutter="[16, 16]">
              <a-col :span="24" :md="12" :lg="12">
                <a-form-item :label="$t('page.database.connectionID')" name="connectionID" class="m-0">
                  <a-select v-model:value="dialogModel.connectionID" :placeholder="$t('page.database.form.connectionID')" :options="connectionOptions" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="12" :lg="12">
                <a-form-item :label="$t('page.database.dataObjectType')" name="dataObjectType" class="m-0">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <a-select v-model:value="dialogModel.dataObjectType" :placeholder="$t('page.database.form.dataObjectType')" :options="translateOptions(dataObjectTypeOptions)" class="flex-1" style="width: 200px;" />
                    <a-button type="primary" class="orange-btn ml-3" @click="showDataObjectModal()">{{$t('page.database.addMapping')}}</a-button>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <div class="flex-grow min-h-0 diagram-container">
            <RelationDiagram ref="relationDiagramRef" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-form>
    <template #footer>
      <a-space :size="13" style="padding-top: 10px;">
        <a-button @click="handleCancel">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
  <DataObjectModal v-model:visible="dataObjectModalVisible" :connection-id="dialogModel.connectionID" :data-object-type="dialogModel.dataObjectType" :selected-data-object-names="selectedDataObjectNames" @delete="handleDelete" @add="handleAdd" />
</template>

<style>
  .ant-card .ant-card-head { min-height: 45px !important; }
  .code-box {height: 360px; border: 1px solid #ddd; padding: 8px 15px 0px 15px;}
  .code { width:100%; height: 300px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; margin-top: 10px;}
  .code .editor { width:100%; height: 300px; }
  .diagram-container { background-color: #fCfCfC; border: #ECF0F1 1px solid; position: relative; height:680px; }
  #requestList .ant-card-body { padding: 0px 18px 0px 18px !important; }
  #requestList .ant-table-tbody>tr>td {padding: 5px 10px 5px 10px !important; }
  #requestList .ant-table-thead >tr>th {padding: 5px 18px 5px 18px !important; }
</style>
