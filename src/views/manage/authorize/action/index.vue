<script setup lang="ts">
import { $t, language } from '@/locales';
import { useRoute, useRouter } from 'vue-router';
import { getPromptMessage } from '@/utils/common';
import { useAppStore } from '@/store/modules/app';
import TokenModal from './modules/token-modal.vue';
import { AuthorizeApi } from '@/service/api/manage';
import Jwt from '@/components/webapi/auths/jwt.vue';
import Ntlm from '@/components/webapi/auths/ntlm.vue';
import Custom from '@/components/webapi/auths/custom.vue';
import Client from '@/components/webapi/auths/client.vue';
import ApiKey from '@/components/webapi/auths/api-key.vue';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import Password from '@/components/webapi/auths/password.vue';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import BasicAuth from '@/components/webapi/auths/basic-auth.vue';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { authTypeOptions, locationOptions, methodOptions, programmeLanguageOptions, tokenRetrievalTypeOptions } from '@/constants/options';

// #region 1. 参数定义
const route = useRoute();
const router = useRouter();
const editor = shallowRef();
const appStore = useAppStore();
const bodyLanguage = ref('json');
const tokenModalVisible = ref(false);
const { formRef } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

// 弹出式提示
const showAlert = ref(false);
const type = ref<'error' | 'success' | 'warning' | 'info'>('success');
const message = ref<string>('');
const description = ref<string>('');

// 编辑器选项
const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true
};

const handleMount = (editorInstance: any) => {
  editor.value = editorInstance;
};

// 创建自定义配置默认参数
const createEmptyCustomItem = (): Api.Authorize.CustomItem => ({
  name: '',
  value: '',
  valueType: 0,
  description: ''
});

const customRef = ref<InstanceType<typeof Custom>>();
const apiKeyRef = ref<InstanceType<typeof ApiKey>>();
const basicAuthRef = ref<InstanceType<typeof BasicAuth>>();
const clientRef = ref<InstanceType<typeof Client>>();
const passwordRef = ref<InstanceType<typeof Password>>();
const jwtRef = ref<InstanceType<typeof Jwt>>();
const ntlmRef = ref<InstanceType<typeof Ntlm>>();

const createDefaultModel = (): Api.Authorize.AuthorizeModel => ({
  id: 0,
  name: '',
  method: 'GET',
  requestUrl: '',
  timeOut: 180,
  type: 0,
  customConfig: [createEmptyCustomItem()],
  apiKeyConfig: {
    key: '',
    value: ''
  },
  basicAuthConfig: {
    username: '',
    password: ''
  },
  clientConfig: {
    clientID: '',
    clientSecret: '',
    scopes: [],
    clientAuthentication: 0
  },
  passwordConfig: {
    clientID: '',
    clientSecret: '',
    username: '',
    password: '',
    scopes: []
  },
  jwtConfig: {
    algorithm: 'HS256',
    secret: '',
    isSecretBase: 0,
    payload: ''
  },
  ntlmConfig: {
    username: '',
    password: '',
    domain: ''
  },
  tokenRetrievalType: 0,
  tokenPath: 'access_token',
  programmeLanguage: 'C#',
  tokenCode: '',
  tokenPassBy: 0,
  tokenPrefix: 'access_token',
  description: ''
});

// 根据语言动态设置 labelCol 宽度
const labelCol = language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } };

// 定义默认模型
const model = ref(createDefaultModel());

// #endregion

// #region 2. 定义规则类型
type RuleKey = Extract<keyof Api.Authorize.AuthorizeModel, 'name' | 'method' | 'requestUrl' | 'type' | 'tokenRetrievalType' | 'programmeLanguage' | 'tokenCode' | 'tokenPassBy' | 'tokenPrefix'>;

// 6. 将rules改为计算属性，根据连接模式动态调整必填字段
const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const nameRule: App.Global.FormRule = {
    required: true,
    validateTrigger: 'blur',
    validator: async (_rule: any, value: string) => {
      const name = (value ?? '').trim();
      if (!name) {
        return Promise.reject(new Error($t('page.authorize.form.name') as string));
      }
      const { response } = await AuthorizeApi.fetchCheckName(name, model.value.id);
      const data = response.data as { code: string; msg: string; data: boolean };
      if (data.msg === 'success' && data.data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    }
  };

  // URL验证规则
  const requestUrlRule: App.Global.FormRule = {
    required: model.value.type === 3 || model.value.type === 4,
    validateTrigger: 'blur',
    validator: async (_rule: any, value: string) => {
      const url = (value ?? '').trim();
      const needUrl = model.value.type === 3 || model.value.type === 4;
      if (!url) {
        return needUrl ? Promise.reject(new Error($t('page.authorize.form.requestUrl') as string)) : Promise.resolve();
      }
      // 验证URL格式（非必填场景下仅在用户输入时校验）
      try {
        new URL(url);
        return Promise.resolve();
      } catch {
        return Promise.reject(new Error($t('common.invalidUrl') as string));
      }
    }
  };

  // 根据type和tokenRetrievalType动态判断必填规则
  const tokenRetrievalTypeRule: App.Global.FormRule = { required: model.value.type === 3 || model.value.type === 4 || model.value.type === 5 ? true : false };
  const tokenPathRule: App.Global.FormRule = { required: (model.value.type === 3 || model.value.type === 4 || model.value.type === 5) && model.value.tokenRetrievalType === 0 ? true : false };
  const programmeLanguageRule: App.Global.FormRule = { required: (model.value.type === 3 || model.value.type === 4 || model.value.type === 5) && model.value.tokenRetrievalType === 1 ? true : false };
  const tokenPassByRule: App.Global.FormRule = { required: model.value.type === 0 || model.value.type === 1 || model.value.type === 3 || model.value.type === 4 || model.value.type === 5 ? true : false };
  const tokenPrefixRule: App.Global.FormRule = { required: model.value.type === 1 || model.value.type === 3 || model.value.type === 4 || model.value.type === 5 ? true : false };
  return {
    name: nameRule,
    method: defaultRequiredRule,
    requestUrl: requestUrlRule,
    type: defaultRequiredRule,
    tokenRetrievalType: tokenRetrievalTypeRule,
    tokenPath: tokenPathRule,
    programmeLanguage: programmeLanguageRule,
    tokenCode: programmeLanguageRule,
    tokenPassBy: tokenPassByRule,
    tokenPrefix: tokenPrefixRule
  };
});
// #endregion

// #region 3. 初始化时
onMounted(async () => {
  const id = Number(route.query.id ?? 0);
  if (id) {
    const { error, data } = await AuthorizeApi.fetchGetModel(id);
    if (!error && data) {
      model.value = { ...createDefaultModel(), ...data };
    }
  }
});
// #endregion
// #region 4. 授权测试
function authorizeTest() {
  formRef.value?.validate().then(async () => {
    const url = (model.value.requestUrl ?? '').trim();
    if (!url) {
      message.value = $t('common.tip')
      description.value = $t('page.authorize.form.requestUrl')
      type.value = 'warning';
      showAlert.value = true;
      return;
    }
    const { error, data } = await AuthorizeApi.fetchTest(model.value);
    if (error) { window.$message?.error($t('common.fail')); return; }
    editor.value.setValue(data ?? '');
  }).catch(() => {
    return;
  });
}

// #region 4. 获取Token
function getToken() {

}

// #region 7. 关闭alert的处理函数
const handleCloseAlert = () => {
  showAlert.value = false;
};
//#endregion

// #region 5. 处理DataHandleModal返回的内容
function handleConfirm(content: string) {
  model.value.tokenCode = content;
  tokenModalVisible.value = false;
}
// #endregion

// #region 6. 保存数据对象
async function handleSave() {
  formRef.value?.validate().then(async () => {
    const { error, response } = await AuthorizeApi.fetchSave(model.value);
    if (error) { window.$message?.error(getPromptMessage(route.query, "Failed")); return; }
    const result = response.data as { code: string; msg: string; data: string };
    if (result.msg === 'success') {
      window.$message?.success(getPromptMessage(route.query, "Success"));
      appStore.tabStore.removeActiveTab();
      router.push({ name: 'manage_authorize_default' });
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

// #region 7. 返回数据库列表
function handleBack() {
  appStore.tabStore.removeActiveTab();
  router.push({ name: 'manage_authorize_default' });
}
// #endregion

// #region 8. 监听语言变化，动态更新 labelCol 的宽度
watch(language, newLang => {
  labelCol.style.width = newLang === 'en-US' ? '130px' : '100px';
});
// #endregion
</script>

<template>
  <div class="h-full min-h-500px flex flex-col pr-3 lt-sm:overflow-auto">
    <a-form ref="formRef" :model="model" :rules="rules" :label-col="labelCol">
      <a-card :title="$t('page.authorize.titleBaseInfo')" :bordered="false">
        <a-row :gutter="[16, 16]">
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.authorize.name')" name="name" class="m-0">
              <a-input v-model:value="model.name" :placeholder="$t('page.authorize.form.name')" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.authorize.description')" name="description" class="m-0">
              <a-input v-model:value="model.description" :placeholder="$t('page.authorize.form.description')" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.authorize.method')" name="method" class="m-0">
              <a-select v-model:value="model.method" :placeholder="$t('page.authorize.form.method')" :options="methodOptions" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.authorize.timeOut')" name="timeOut" class="m-0">
              <a-input-number v-model:value="model.timeOut" :placeholder="$t('page.authorize.form.timeOut')" class="w-full" min="0" max="600" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="24" :lg="24">
            <a-form-item :label="$t('page.authorize.requestUrl')" name="requestUrl" class="m-0">
              <div style="display: flex; align-items: center; gap: 10px">
                <a-input v-model:value="model.requestUrl" :placeholder="$t('page.authorize.form.requestUrl')"  class="flex-1" />
                <a-button type="primary" class="orange-btn ml-3" @click="authorizeTest">{{ $t('page.authorize.authorizeTest') }}</a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card :title="$t('page.authorize.titleAuthorize')" :bordered="false">
        <a-row :gutter="[16, 16]">
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.authorize.type')" name="type" class="m-0">
              <a-select v-model:value="model.type" :placeholder="$t('page.authorize.form.type')" :options="authTypeOptions" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.authorize.tokenRetrievalType')" name="tokenRetrievalType" class="m-0">
              <a-select v-model:value="model.tokenRetrievalType" :placeholder="$t('page.authorize.form.tokenRetrievalType')" :options="tokenRetrievalTypeOptions" allow-clear :disabled="model.type === 0 || model.type === 1 || model.type === 2 || model.type === 6" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.authorize.tokenPath')" name="tokenPath" class="m-0">
              <a-input v-model:value="model.tokenPath" :placeholder="$t('page.authorize.form.tokenPath')" :disabled="model.tokenRetrievalType === 1 || model.type === 0 || model.type === 1 || model.type === 2 || model.type === 6" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.authorize.tokenCode')" name="tokenCode" class="m-0">
              <div style="display: flex; align-items: center; gap: 10px">
                <a-select v-model:value="model.programmeLanguage" :placeholder="$t('page.task.form.programmeLanguage')" :options="programmeLanguageOptions" allow-clear class="flex-1" :disabled="model.tokenRetrievalType === 0 || model.type === 0 || model.type === 1 || model.type === 2 || model.type === 6" />
                <a-button type="primary" class="bule-btn ml-3" :disabled="model.tokenRetrievalType === 0" @click="getToken">
                  {{ $t('page.authorize.tokenCode') }}
                </a-button>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.authorize.tokenPassBy')" name="tokenPassBy" class="m-0">
              <a-select v-model:value="model.tokenPassBy" :placeholder="$t('page.task.form.dataHandle')" :options="locationOptions" allow-clear :disabled="model.type === 2 || model.type === 6" />
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12" :lg="12">
            <a-form-item :label="$t('page.authorize.tokenPrefix')" name="tokenPrefix" class="m-0">
              <a-input v-model:value="model.tokenPrefix" :placeholder="$t('page.authorize.form.tokenPrefix')" :disabled="model.type === 0 || model.type === 2 || model.type === 6" />
            </a-form-item>
          </a-col>
        </a-row>
        <div v-if="model.type == 0">
          <Custom ref="customRef" v-model:model="model.customConfig" />
        </div>
        <div v-if="model.type == 1" class="mt-4">
          <ApiKey ref="apiKeyRef" v-model:model="model.apiKeyConfig" />
        </div>
        <div v-if="model.type == 2" class="mt-4">
          <BasicAuth ref="basicAuthRef" v-model:model="model.basicAuthConfig" />
        </div>
        <div v-if="model.type == 3" class="mt-4">
          <Client ref="clientRef" v-model:model="model.clientConfig" />
        </div>
        <div v-if="model.type == 4" class="mt-4">
          <Password ref="passwordRef" v-model:model="model.passwordConfig" />
        </div>
        <div v-if="model.type == 5" class="mt-4">
          <Jwt ref="jwtRef" v-model:model="model.jwtConfig" />
        </div>
        <div v-if="model.type == 6" class="mt-4">
          <Ntlm ref="ntlmRef" v-model:model="model.ntlmConfig" />
        </div>
      </a-card>
      <a-card :title="$t('page.authorize.titleResponse')" :bordered="false" class="flex flex-col flex-1">
        <div class="h-full flex flex-col flex-1">
          <a-radio-group v-model:value="bodyLanguage" class="mb-4 mt-0">
            <a-radio value="json">json</a-radio>
            <a-radio value="xml">xml</a-radio>
            <a-radio value="html">html</a-radio>
            <a-radio value="text">text</a-radio>
          </a-radio-group>
          <a-row :gutter="[16, 16]" class="text-align-center">
            <a-col :span="24" :md="24" :lg="24" class="code-container m-0">
              <VueMonacoEditor v-model:value="model.tokenCode" theme="vs" :options="MONACO_EDITOR_OPTIONS" :language="bodyLanguage" style="width: 100%; height: 380px" @mount="handleMount" />
            </a-col>
            <a-col :span="24" :md="24" :lg="24">
              <a-button type="primary" class="blue-btn mr-8 pl-6 pr-6" @click="handleSave">
                {{ $t('common.save') }}
              </a-button>
              <a-button type="primary" ghost class="pl-6 pr-6" @click="handleBack">
                {{ $t('common.back') }}
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </a-form>
    <TokenModal v-model:visible="tokenModalVisible" :programme-language="model.programmeLanguage" @confirm="handleConfirm" />
    <CustomAlert v-if="showAlert"  :message="message" :type="type" :description="description" show-icon closable @close="handleCloseAlert" />
  </div>
</template>

<style scoped>
  .flex-1 { flex: 1 !important; }
  .code-container { background-color: #fcfcfc; border: #ecf0f1 1px solid; position: relative; }
  ::v-deep .ant-card .ant-card-body { height: 100%; flex: 1; box-sizing: border-box; overflow: hidden; }
</style>
