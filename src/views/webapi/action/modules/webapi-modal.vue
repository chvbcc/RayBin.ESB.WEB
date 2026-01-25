<script setup lang="tsx">
  import { $t, language } from '@/locales';
  import { TaskWebApi } from '@/service/api/task';
  import { useAuthStore } from '@/store/modules/auth';
  import DataObjectModal from './data-object-modal.vue';
  import { parseJsonToTables } from '@/utils/jsonparsing';
  import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
  import type { editor as MonacoEditor } from 'monaco-editor';  ;
  import RequestBody from '@/components/webapi/request/body.vue';
  import { useAntdForm, useFormRules } from '@/hooks/common/form';
  import { translateOptions, isJson, isUrl } from '@/utils/common';
  import RequestHeader from '@/components/webapi/request/headers.vue';
  import { fetchGetConnectionOptions } from '@/service/api/connection';
  import RelationDiagram from '@/components/webapi/relation-diagram.vue';
  import QueryParameter from '@/components/webapi/request/parameters.vue';
  import { ref, onMounted, computed, shallowRef, watch, nextTick } from 'vue';
  import { locationOptions, methodOptions, interfaceTypeOptions, dataObjectTypeOptions } from '@/constants/options';

  // 定义变量 参数 事件
  // #region 默认代码
  // 监听programmeLanguage变化，更新语言和代码
  const dataHandleCsharpCode = `
    // This C# Code Example
    // Convert the non JSON data returned by the API into the JSON format defined in ResponseBody
    private string HandleApiResult(string apiResult)
    {
        // 用户代码
        var responseBody = new
        {
          value = apiResult.Substring(0, 1),
        };
        return JsonConvert.SerializeObject(responseBody);
    }

    // Task ends after execution
    private void TaskAfterEnds(DatabaseAccessor dataHelper) {
      // 用户代码
    }
  `
  const dataHandlePythonCode = `
    # This Python Code Example
    # Convert the non JSON data returned by the API into the JSON format defined in ResponseBody
    import clr
    clr.AddReference('Newtonsoft.Json')
    from Newtonsoft.Json import JsonConvert

    def handle_api_result(api_result):
      response_body = {"value": api_result[0:1] }
      return JsonConvert.SerializeObject(response_body);

    # Task ends after execution
    def task_after_ends(data_helper):
      # 用户代码
      pass
  `
  // #endregion
  const formRef = ref();
  const diagramData = ref({cells: []});
  const authStore = useAuthStore();
  const { defaultRequiredRule } = useFormRules();
  const { formRef: formRefDialog } = useAntdForm();

  const editorScript = shallowRef();
  const editorScriptClass = ref<string>('editor');
  const scriptEditorMount = (editorScriptInstance: MonacoEditor.IStandaloneCodeEditor) => (editorScript.value = editorScriptInstance);

  const editorResponse = shallowRef();
  const editorResponseClass = ref<string>('editor');
  const responseEditorMount = (editorResponseInstance: MonacoEditor.IStandaloneCodeEditor) => (editorResponse.value = editorResponseInstance);

  const tabKey = ref<string | number>(1);
  const dataHandleLanguage = ref<string>("csharp")

  const requestBodyRef = ref<InstanceType<typeof RequestBody>>();
  const requestHeaderRef = ref<InstanceType<typeof RequestHeader>>();
  const queryParameterRef = ref<InstanceType<typeof QueryParameter>>();
  const relationDiagramRef =  ref<InstanceType<typeof RelationDiagram>>();

  const authorizeOptions = ref<CommonType.Option[]>([]);
  const authorizeData = ref<Api.Authorize.Authorize[]>([]);

  const emit = defineEmits(['update:visible', 'confirm']);
  const visible = defineModel<boolean>('visible', { default: false });
  const webApiModel = defineModel<Api.Task.TaskWebApi>('value', { default: () => ({}) });

  // 根据语言动态设置 labelCol 宽度
  const labelCol = computed(() => language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } });
  const title = computed(() => Number(webApiModel.value.id ?? 0) > 0 ? $t('page.webApi.requestEdit') : $t('page.webApi.requestNew'));

  type webApiRuleKey = Extract<keyof Api.Task.TaskWebApi, 'interfaceType' | 'method' | 'timeOut' | 'requestUrl'>;
  const formRules = computed<Record<webApiRuleKey, App.Global.FormRule>>(() => {
      const requestUrlRule: App.Global.FormRule = {
      required: true,
      validateTrigger: ['blur','change'],
      validator: async (_rule: any, value: string) => {
        const input = (value ?? '').trim();
        if (!input || !isUrl(input)) {
          return Promise.reject();
        }
        return Promise.resolve();
      }
    };
    return {
      interfaceType: defaultRequiredRule,
      method: defaultRequiredRule,
      timeOut: defaultRequiredRule,
      requestUrl: requestUrlRule,
    };
  });

  const dataObjectModalVisible = ref(false);
  const connectionOptions = ref<{ label: string; value: number }[]>([]);
  const dialogModel = ref<Api.Task.DialogModal>({connectionID: undefined, dataObjectType: 'table'});
  const selectedDataObjectNames = ref<string[]>([]);

  type dialogRuleKey = Extract<keyof Api.Task.DialogModal, 'connectionID' | 'dataObjectType'>;
  const dialogRules = computed<Record<dialogRuleKey, App.Global.FormRule | App.Global.FormRule[]>>(() => {
    const isPullOrPush = webApiModel.value.interfaceType === '8001' || webApiModel.value.interfaceType === '8002';
    return {
      connectionID: isPullOrPush ? defaultRequiredRule : [],
      dataObjectType: isPullOrPush ? defaultRequiredRule : [],
    };
  });

  const objectTypeOptions = computed(() => {
    if (webApiModel.value.interfaceType === '8001') {
      return dataObjectTypeOptions.filter(option => option.value !== 'storedProcedure' && option.value !== 'view')
    } else {
      return dataObjectTypeOptions.filter(option => option.value !== 'storedProcedure')
    }
  });

  // 编辑器选项
  const MONACO_EDITOR_OPTIONS = {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
    theme: "vs",
  }

  // 处理确定按钮
  async function handleConfirm() {
    const valid = await formRef.value?.validate?.().catch(() => false);
    let validBody = await requestBodyRef.value?.validate?.();
    if (validBody=== undefined) validBody = true;

    let validQueryParameter = await queryParameterRef.value?.validate?.();
    if (validQueryParameter === undefined) validQueryParameter = true;

    let validHeader = await requestHeaderRef.value?.validate?.();
    if (validHeader === undefined) validHeader = true;

    if (!valid || !validBody || !validQueryParameter || !validHeader) {
      tabKey.value = 1;
      return;
    }

    // 非调用类型
    if (webApiModel.value.interfaceType !== "8000") {
      if (editorResponse.value !== undefined) {
        webApiModel.value.responseBody = editorResponse.value.getValue();
      }
      if (webApiModel.value.responseBody.trim() === '' || !isJson(webApiModel.value.responseBody)) {
        tabKey.value = 2;
        editorResponseClass.value = 'editor-error';
        return;
      }
      editorResponseClass.value = 'editor';
    }

    if (webApiModel.value.dataHandle === 1 && editorScript.value !== undefined) {
      webApiModel.value.dataHandleScript = editorScript.value.getValue();
      if (webApiModel.value.dataHandleScript.trim() === '') {
        tabKey.value = 3;
        editorScriptClass.value = 'editor-error';
        return;
      } else {
        editorScriptClass.value = 'editor';
      }
    }

    webApiModel.value.diagramData = JSON.stringify(relationDiagramRef.value?.getData() ?? {cells: []});
    if (webApiModel.value.interfaceType !== "8000" && relationDiagramRef.value?.validateUnusedNodes()) {
      window.$message?.error($t('page.webApi.needDataMapping'));
      tabKey.value = 4;
      return;
    }
    emit('confirm', webApiModel.value);
    visible.value = false;
  }

  const handleTabChange = async (key: string | number) => {
    tabKey.value = key;
    if (key === 4) {
      await nextTick();
      // 恢复编辑的节点
      if (webApiModel.value.id > 0 && diagramData.value.cells.length > 0) {
        relationDiagramRef.value?.setData(diagramData.value)
        return;
      }
      // 获取最新的API节点数据
      const newApiCells = getNewApiCells();
      if (newApiCells && newApiCells.length > 0) {
        // 检查是否已有API节点
        const hasApiNodes = diagramData.value.cells.some((cell: any) => cell.data && cell.data.nodeType === 'api');
        if (!hasApiNodes) {
          // 如果没有API节点，直接添加
          diagramData.value.cells.push(...newApiCells as never[]);
        } else {
          // 如果已有API节点，先删除现有的API节点，然后重新添加
          diagramData.value.cells = diagramData.value.cells.filter((cell: any) => !(cell.data && cell.data.nodeType === 'api'));
          diagramData.value.cells.push(...newApiCells as never[]);
        }
        // 创建新的WebApi节点
        relationDiagramRef.value?.setData(diagramData.value);
      }
    }
    else {
      await nextTick();
      if (relationDiagramRef.value) {
        const componentData = relationDiagramRef.value.getData();
        if (typeof componentData === 'object' && componentData.cells.length > 0) {
          diagramData.value = componentData;
        }
      }
    }
  }

  function getNewApiCells() {
      // 解析 responseBody 获取数据对象节点
      const responseBody = editorResponse.value === undefined ? webApiModel.value.responseBody : editorResponse.value.getValue();
      if (!isJson(responseBody)) return;
      let data = JSON.parse(responseBody);
      const tables = parseJsonToTables(data);
      tables.forEach(table => {
        console.log(table.tableName);
      });
      debugger
      const newNodes  = tables.map(table => ({
        id: String(table.id),
        shape: 'er-rect',
        width: table.width,
        height: 28,
        x: 0,
        y: 0,
        data: { connectionId: 0, dataObjectType: 'table', id: table.id, parentId: table.parentId, nodeType: 'api' },
        attrs: {
          rect: {stroke: '#636b6d', fill: '#798386'},
          text: { text: table.tableName }
        },
        ports: {
          items: table.fields.map((field, index) => ({
            id: String(index),
            group: 'list',
            keyType: 0,
            attrs: {
              portBody: { width: table.width, height: 28,stroke: '#798386', fill: '#F8F8F8'  },
              portNameLabel: { text: field.fieldName },
              portTypeLabel: { text: field.fieldType, refX: table.fieldTypeX }
            }
          }))
        }
      }));
      return newNodes;
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

  // 初始化授权选项
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

  // 处理授权选项变更
  function handleAuthorizeChange(authorizeId: number | undefined) {
    if (!authorizeId) return;
    const selectedAuthorize = authorizeData.value.find(item => item.id === authorizeId);
    if (selectedAuthorize) {
      webApiModel.value.tokenPassBy = selectedAuthorize.tokenPassBy;
      webApiModel.value.tokenPrefix = selectedAuthorize.tokenPrefix;
    }
  }

  // 处理响应内容变化
  function responseBodyChange() {
    const stringValue = editorResponse.value.getValue();
    if (stringValue.trim() === '' || !isJson(stringValue)) {
      editorResponseClass.value = 'editor-error';
    } else {
      editorResponseClass.value = 'editor';
    }
  }

  // #region 12. 处理数据处理脚本语言切换
  function dataHandleChange(dataHandle: number) {
    if (dataHandle === 0) {
      webApiModel.value.dataHandleScript = '';
      editorScriptClass.value = 'editor';
      return;
    }
    if (dataHandle === 1) {
      dataHandleLanguageChange(webApiModel.value.dataHandleLanguage);
    }
  }

  function dataHandleLanguageChange(language: string) {
    if (webApiModel.value.dataHandle === 0) {
      webApiModel.value.dataHandleScript = '';
      return;
    }
    if (language === '7000') {
      dataHandleLanguage.value = 'csharp';
      webApiModel.value.dataHandleScript = dataHandleCsharpCode;
    } else if (language === '7001') {
      dataHandleLanguage.value = 'python';
      webApiModel.value.dataHandleScript = dataHandlePythonCode;
    }
    editorScriptClass.value = 'editor';
  }

  function dataHandleScriptChange() {
    if (editorScript.value.getValue().trim() === '' && webApiModel.value.dataHandle === 1) {
      editorScriptClass.value = 'editor-error';
    } else {
      editorScriptClass.value = 'editor';
    }
  }
  // #endregion

  // 显示数据对象模态框
  function showDataObjectModal() {
    formRefDialog.value?.validate(['connectionID', 'dataObjectType']).then(() => {
      selectedDataObjectNames.value = relationDiagramRef.value?.getDataObjectNames() || [];
      dataObjectModalVisible.value = true;
    })
  }

  // 删除数据对象
  function handleDelete(deleteItems: string[], dataObjectType: Api.Task.DataObjectType) {
    relationDiagramRef.value?.deleteDataObjects(deleteItems, dataObjectType);
  }

  // 添加数据对象
  async function handleAdd(dataObjectNodes: Api.Task.DataObjectNode[]) {
    relationDiagramRef.value?.addDataObjects(dataObjectNodes);
  }

  // 测试接口
  async function handleTest() {
    const { error, data } = await TaskWebApi.fetchTest(webApiModel.value);
    if (!error && webApiModel.value.responseBody === '') {
      if (data === '') return;
      webApiModel.value.responseBody = data;
      editorResponseClass.value = 'editor';
    }
  }

  // 监听 visible 改变
  watch(visible, async (newVisible) => {
    if (newVisible) {
      tabKey.value = 1;
      await nextTick(() => {
        if (webApiModel.value.id === 0) {
          formRef.value?.clearValidate();
          requestBodyRef.value?.clearValidate();
          queryParameterRef.value?.clearValidate();
          requestHeaderRef.value?.clearValidate();
          formRefDialog.value?.clearValidate();
          editorResponseClass.value = 'editor';
          editorScriptClass.value = 'editor';
          diagramData.value = { cells: [] };
        } else {
            diagramData.value = JSON.parse(webApiModel.value.diagramData);
        }
        relationDiagramRef.value?.clearNodes();
      })
    }
  });

  // 组件挂载
  onMounted(async () => {
    await initConnectionOptions();
    await initAuthorizeOptions();
  });
</script>

<template>
  <a-modal v-model:open="visible" :title="title" style="width: 90%; height: 80vh; max-width: 1800px;">
    <a-form ref="formRef" :model="value" :rules="formRules" layout="horizontal" class="h-full"  :label-col="labelCol">
      <a-tabs :active-key="tabKey" class="h-full" @change="handleTabChange">
        <a-tab-pane :key="1" :tab="$t('page.webApi.requestInfo')">
          <a-card :title="$t('page.authorize.titleBaseInfo')" :bordered="true" class="mt-1">
            <a-row :gutter="[16, 16]" class="text-align-center">
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.interfaceType')" name="interfaceType" class="m-2">
                  <a-select v-model:value="webApiModel.interfaceType" :options="translateOptions(interfaceTypeOptions)" :placeholder="$t('page.webApi.form.interfaceType')" class="w-full"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.method')" name="method" class="m-2">
                  <a-select v-model:value="webApiModel.method" :options="methodOptions" :placeholder="$t('page.webApi.form.method')" class="w-full"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.timeOut')" name="timeOut" class="m-2">
                  <a-input-number v-model:value="webApiModel.timeOut" class="w-full" :min="0" :placeholder="$t('page.webApi.form.timeOut')" />
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.authorize')" name="authorize" class="m-2">
                  <a-select v-model:value="webApiModel.authorizeID" :options="authorizeOptions" :placeholder="$t('page.webApi.form.authorize')" class="w-full" @change="handleAuthorizeChange(webApiModel.authorizeID)"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.tokenPassBy')" name="tokenPassBy" class="m-2">
                  <a-select v-model:value="webApiModel.tokenPassBy" :options="locationOptions" :placeholder="$t('page.webApi.form.tokenPassBy')" class="w-full"></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="8" :lg="8">
                <a-form-item :label="$t('page.webApi.tokenPrefix')" name="tokenPrefix" class="m-2">
                  <a-input v-model:value="webApiModel.tokenPrefix" :placeholder="$t('page.webApi.form.tokenPrefix')" class="w-full"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24" :md="24" :lg="24">
                <a-form-item :label="$t('page.webApi.requestUrl')" name="requestUrl" class="m-2">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <a-input v-model:value="webApiModel.requestUrl" :placeholder="$t('page.webApi.form.requestUrl')" class="flex-1" />
                  <a-button type="primary" class="bule-btn ml-3" @click="handleTest">{{$t('page.webApi.interfaceTest')}}</a-button>
                </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card id="requestList" :title="$t('page.webApi.requestBodyContent')" :bordered="true" class="mt-5 mb-2">
            <a-tabs default-active-key="1" class="h-full">
              <a-tab-pane :key="1" :tab="$t('page.webApi.queryParameter')">
                <query-parameter ref="queryParameterRef" style="height: 360px;" v-model:model="webApiModel.queryParameters" />
              </a-tab-pane>
              <a-tab-pane :key="2" :tab="$t('page.webApi.requestBody')">
                <request-body ref="requestBodyRef" style="height: 360px;" v-model:model="webApiModel.requestBody" />
              </a-tab-pane>
              <a-tab-pane :key="3" :tab="$t('page.webApi.headers')">
                <request-header ref="requestHeaderRef" style="height: 360px;" v-model:model="webApiModel.headers" />
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :key="2" :tab="$t('page.webApi.responseInfo')">
          <div class="code-box">
            <span>{{$t('page.webApi.statusHandleScript')}}： </span>
            <a-input v-model:value="webApiModel.statusHandleScript" class="w-128" :placeholder="$t('page.webApi.form.statusHandleScript')" />
            <span class="required pl-5"> * </span><span>{{$t('page.webApi.responseContentTip')}}： </span>
            <div class="code">
              <vue-monaco-editor v-model:value="webApiModel.responseBody" theme="vs" :options="MONACO_EDITOR_OPTIONS" :class="editorResponseClass" language="json" @mount="responseEditorMount" @change="responseBodyChange" />
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="3" :tab="$t('page.webApi.dataHandle')">
          <div class="code-box">
            <div class="inline pr-5">
              <span class="required"> * </span><span>{{$t('page.webApi.dataHandle')}}： </span>
              <a-switch v-model:checked="webApiModel.dataHandle" :checkedValue="1" :unCheckedValue="0" @change="dataHandleChange(webApiModel.dataHandle)" />
            </div>
            <div class="inline">
              <span class="required" v-if="webApiModel.dataHandle"> * </span><span>{{$t('page.webApi.dataHandleScript')}}： </span>
              <a-radio-group v-model:value="webApiModel.dataHandleLanguage" @change="dataHandleLanguageChange(webApiModel.dataHandleLanguage)">
                <a-radio value="7000">csharp</a-radio>
                <a-radio value="7001">python</a-radio>
              </a-radio-group>
            </div>
            <div class="code">
              <vue-monaco-editor v-model:value="webApiModel.dataHandleScript" theme="vs" :options="MONACO_EDITOR_OPTIONS" :class="editorScriptClass" :language="dataHandleLanguage" @mount="scriptEditorMount" @change="dataHandleScriptChange" />
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="4" :tab="$t('page.webApi.dataMapping')">
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
                    <a-select v-model:value="dialogModel.dataObjectType" :placeholder="$t('page.database.form.dataObjectType')" :options="translateOptions(objectTypeOptions)" class="flex-1" style="width: 200px;" />
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
  .required { color: red; }
  .ant-card .ant-card-head { min-height: 45px !important; }
  .code-box { width:100%; height: 680px; border: 1px solid #ddd; padding: 8px 15px 0px 15px;}
  .code { width:100%; height: 622px; overflow: hidden; margin-top: 10px;}
  .code .editor       { width:100%; height: 622px; border: 1px solid #ddd; border-radius: 4px; }
  .code .editor-error { border: 1px solid red; border-radius: 4px;}
  .diagram-container { background-color: #fCfCfC; border: #ECF0F1 1px solid; position: relative; width:100%; height:680px; }
  #requestList .ant-card-body { padding: 0px 18px 0px 18px !important; }
  #requestList .ant-table-tbody>tr>td {padding: 5px 10px 5px 10px !important; }
  #requestList .ant-table-thead >tr>th {padding: 5px 18px 5px 18px !important; }
</style>
