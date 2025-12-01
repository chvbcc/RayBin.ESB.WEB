<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import Jwt from '@/components/webapi/auths/jwt.vue';
import Ntlm from '@/components/webapi/auths/ntlm.vue';
import Custom from '@/components/webapi/auths/custom.vue';
import Client from '@/components/webapi/auths/client.vue';
import ApiKey from '@/components/webapi/auths/api-key.vue';
import Password from '@/components/webapi/auths/password.vue';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import BasicAuth from '@/components/webapi/auths/basic-auth.vue';
import { useAppStore } from '@/store/modules/app';
import { $t, language } from '@/locales';
import { AuthorizeApi } from '@/service/api/manage';
import { authTypeOptions, locationOptions, methodOptions, programmeLanguageOptions, tokenRetrievalTypeOptions } from '@/constants/options';
import TokenModal from './modules/token-modal.vue';

// #region 1. 参数定义
const route = useRoute();
const router = useRouter();
const editor = shallowRef();
const appStore = useAppStore();
const bodyLanguage = ref('json');
const tokenModalVisible = ref(false);
const { formRef, validate } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

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

// 自定义配置默认参数
const customConfig = ref<Api.Authorize.CustomItem[]>([createEmptyCustomItem()]);
// API密钥配置默认参数
const apiKeyConfig = ref<Api.Authorize.ApiKeyConfig>({ key: '', value: '' });
// 客户端配置默认参数
const basicAuthConfig = ref<Api.Authorize.BasicAuthConfig>({ username: '', password: '' });
// 客户端配置默认参数
const clientConfig = ref<Api.Authorize.ClientConfig>({
  clientID: '',
  clientSecret: '',
  scopes: [],
  clientAuthentication: 0
});
// 密码配置默认参数
const passwordConfig = ref<Api.Authorize.PasswordConfig>({
  clientID: '',
  clientSecret: '',
  username: '',
  password: '',
  scopes: []
});
// JWT 默认参数
const jwtConfig = ref<Api.Authorize.JwtConfig>({ algorithm: '', secret: '', isSecretBase: 0, payload: '' });
// NTLM 默认参数
const ntlmConfig = ref<Api.Authorize.NtlmConfig>({ username: '', password: '', domain: '' });

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

// #region 4. 定义规则类型
type RuleKey = Extract<
  keyof Api.Authorize.AuthorizeModel,
  | 'name'
  | 'method'
  | 'requestUrl'
  | 'type'
  | 'tokenRetrievalType'
  | 'tokenPath'
  | 'programmeLanguage'
  | 'tokenCode'
  | 'tokenPassBy'
  | 'tokenPrefix'
>;

// 6. 将rules改为计算属性，根据连接模式动态调整必填字段
const rules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => {
  const nameRule: App.Global.FormRule[] = [
    {
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
    }
  ];

  // 根据type和tokenRetrievalType动态判断必填规则
  const tokenRetrievalTypeRule = model.value.type === 3 || model.value.type === 4 || model.value.type === 5 ? [defaultRequiredRule] : [{ required: false }];
  const tokenPathRule = (model.value.type === 3 || model.value.type === 4 || model.value.type === 5) && model.value.tokenRetrievalType === 0 ? [defaultRequiredRule] : [{ required: false }];
  const programmeLanguageRule = (model.value.type === 3 || model.value.type === 4 || model.value.type === 5) && model.value.tokenRetrievalType === 1 ? [defaultRequiredRule] : [{ required: false }];
  const tokenPassByRule = model.value.type === 0 || model.value.type === 1 || model.value.type === 3 || model.value.type === 4 || model.value.type === 5 ? [defaultRequiredRule] : [{ required: false }];
  const tokenPrefixRule = model.value.type === 1 || model.value.type === 3 || model.value.type === 4 || model.value.type === 5 ? [defaultRequiredRule] : [{ required: false }];
  return {
    name: nameRule,
    method: [defaultRequiredRule],
    requestUrl: [defaultRequiredRule],
    type: [defaultRequiredRule],
    tokenRetrievalType: tokenRetrievalTypeRule,
    tokenPath: tokenPathRule,
    programmeLanguage: programmeLanguageRule,
    tokenCode: programmeLanguageRule,
    tokenPassBy: tokenPassByRule,
    tokenPrefix: tokenPrefixRule
  };
});
// #endregion

// #region 2. 初始化时
onMounted(async () => {
  // 从路由参数中获取ID （加载编辑数据）
  const id = Number(route.query.id ?? 0);
  if (id) {
  }
});
// #endregion

// #region 3. 获取Token
function getToken() {
  tokenModalVisible.value = true;
}

// #region 3. 处理DataHandleModal返回的内容
function handleConfirm(content: string) {
  model.value.tokenCode = content;
  tokenModalVisible.value = false;
}
// #endregion

// #region 4. 保存数据对象
async function handleSave() {
  await validate();
  console.log(customConfig.value);
  console.log(apiKeyConfig.value);
  console.log(basicAuthConfig.value);
  console.log(clientConfig.value);
  console.log(passwordConfig.value);
  console.log(jwtConfig.value);
  console.log(bodyLanguage.value);
}
// #endregion

// #region 5. 返回数据库列表
function handleBack() {
  appStore.tabStore.removeActiveTab();
  router.push({ name: 'database' });
}
// #endregion

// #region 6. 监听语言变化，动态更新 labelCol 的宽度
watch(language, newLang => {
  labelCol.style.width = newLang === 'en-US' ? '130px' : '100px';
});
// #endregion
</script>

<template>
  <div class="h-full min-h-500px flex flex-col pr-3 lt-sm:overflow-auto">
    <AForm ref="formRef" :model="model" :rules="rules" :label-col="labelCol">
      <ACard :title="$t('page.authorize.titleBaseInfo')" :bordered="false">
        <ARow :gutter="[16, 16]">
          <ACol :span="24" :md="12" :lg="12">
            <AFormItem :label="$t('page.authorize.name')" name="name" class="m-0">
              <AInput v-model:value="model.name" :placeholder="$t('page.authorize.form.name')" />
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="12" :lg="12">
            <AFormItem :label="$t('page.authorize.description')" name="description" class="m-0">
              <AInput v-model:value="model.description" :placeholder="$t('page.authorize.form.description')" />
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="12" :lg="12">
            <AFormItem :label="$t('page.authorize.method')" name="method" class="m-0">
              <ASelect
                v-model:value="model.method"
                :placeholder="$t('page.authorize.form.method')"
                :options="methodOptions"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="12" :lg="12">
            <AFormItem :label="$t('page.authorize.timeOut')" name="timeOut" class="m-0">
              <AInputNumber
                v-model:value="model.timeOut"
                :placeholder="$t('page.authorize.form.timeOut')"
                class="w-full"
                min="0"
                max="600"
              />
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="24" :lg="24">
            <AFormItem :label="$t('page.authorize.requestUrl')" name="requestUrl" class="m-0">
              <div style="display: flex; align-items: center; gap: 10px">
                <AInput
                  v-model:value="model.requestUrl"
                  :placeholder="$t('page.authorize.form.requestUrl')"
                  class="flex-1"
                />
                <AButton type="primary" class="orange-btn ml-3">{{ $t('page.authorize.getToken') }}</AButton>
              </div>
            </AFormItem>
          </ACol>
        </ARow>
      </ACard>
      <ACard :title="$t('page.authorize.titleAuthorize')" :bordered="false">
        <ARow :gutter="[16, 16]">
          <ACol :span="24" :md="12" :lg="12">
            <AFormItem :label="$t('page.authorize.type')" name="type" class="m-0">
              <ASelect v-model:value="model.type" :placeholder="$t('page.authorize.form.type')" :options="authTypeOptions" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="12" :lg="12">
            <AFormItem :label="$t('page.authorize.tokenRetrievalType')" name="tokenRetrievalType" class="m-0">
              <ASelect
                v-model:value="model.tokenRetrievalType"
                :placeholder="$t('page.authorize.form.tokenRetrievalType')"
                :options="tokenRetrievalTypeOptions"
                allow-clear
                :disabled="model.type === 0 || model.type === 1 || model.type === 2 || model.type === 6"
              />
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="12" :lg="12">
            <AFormItem :label="$t('page.authorize.tokenPath')" name="tokenPath" class="m-0">
              <AInput
                v-model:value="model.tokenPath"
                :placeholder="$t('page.authorize.form.tokenPath')"
                :disabled="
                  model.tokenRetrievalType === 1 ||
                  model.type === 0 ||
                  model.type === 1 ||
                  model.type === 2 ||
                  model.type === 6
                "
              />
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="12" :lg="12">
            <AFormItem :label="$t('page.authorize.tokenCode')" name="tokenCode" class="m-0">
              <div style="display: flex; align-items: center; gap: 10px">
                <ASelect
                  v-model:value="model.programmeLanguage"
                  :placeholder="$t('page.task.form.programmeLanguage')"
                  :options="programmeLanguageOptions"
                  allow-clear
                  class="flex-1"
                  :disabled="
                    model.tokenRetrievalType === 0 ||
                    model.type === 0 ||
                    model.type === 1 ||
                    model.type === 2 ||
                    model.type === 6
                  "
                />
                <AButton
                  type="primary"
                  class="bule-btn ml-3"
                  :disabled="model.tokenRetrievalType === 0"
                  @click="getToken"
                >
                  {{ $t('page.authorize.tokenCode') }}
                </AButton>
              </div>
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="12" :lg="12">
            <AFormItem :label="$t('page.authorize.tokenPassBy')" name="tokenPassBy" class="m-0">
              <ASelect
                v-model:value="model.tokenPassBy"
                :placeholder="$t('page.task.form.dataHandle')"
                :options="locationOptions"
                allow-clear
                :disabled="model.type === 2 || model.type === 6"
              />
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="12" :lg="12">
            <AFormItem :label="$t('page.authorize.tokenPrefix')" name="tokenPrefix" class="m-0">
              <AInput
                v-model:value="model.tokenPrefix"
                :placeholder="$t('page.authorize.form.tokenPrefix')"
                :disabled="model.type === 0 || model.type === 2 || model.type === 6"
              />
            </AFormItem>
          </ACol>
        </ARow>
        <div v-if="model.type == 0">
          <Custom ref="customRef" v-model:model="customConfig" />
        </div>
        <div v-if="model.type == 1" class="mt-4">
          <ApiKey ref="apiKeyRef" v-model:model="apiKeyConfig" />
        </div>
        <div v-if="model.type == 2" class="mt-4">
          <BasicAuth ref="basicAuthRef" v-model:model="basicAuthConfig" />
        </div>
        <div v-if="model.type == 3" class="mt-4">
          <Client ref="clientRef" v-model:model="clientConfig" />
        </div>
        <div v-if="model.type == 4" class="mt-4">
          <Password ref="passwordRef" v-model:model="passwordConfig" />
        </div>
        <div v-if="model.type == 5" class="mt-4">
          <Jwt ref="jwtRef" v-model:model="jwtConfig" />
        </div>
        <div v-if="model.type == 6" class="mt-4">
          <Ntlm ref="ntlmRef" v-model:model="ntlmConfig" />
        </div>
      </ACard>
      <ACard :title="$t('page.authorize.titleResponse')" :bordered="false" class="flex flex-col flex-1">
        <div class="h-full flex flex-col flex-1">
          <ARadioGroup v-model:value="bodyLanguage" class="mb-4 mt-0">
            <ARadio value="json">json</ARadio>
            <ARadio value="xml">xml</ARadio>
            <ARadio value="html">html</ARadio>
            <ARadio value="text">text</ARadio>
          </ARadioGroup>
          <ARow :gutter="[16, 16]" class="text-align-center">
            <ACol :span="24" :md="24" :lg="24" class="code-container m-0">
              <VueMonacoEditor
                v-model:value="model.tokenCode"
                theme="vs"
                :options="MONACO_EDITOR_OPTIONS"
                :language="bodyLanguage"
                style="width: 100%; height: 380px"
                @mount="handleMount"
              />
            </ACol>
            <ACol :span="24" :md="24" :lg="24">
              <AButton type="primary" class="blue-btn mr-8 pl-6 pr-6" @click="handleSave">
                {{ $t('common.save') }}
              </AButton>
              <AButton type="primary" ghost class="pl-6 pr-6" @click="handleBack">
                {{ $t('common.back') }}
              </AButton>
            </ACol>
          </ARow>
        </div>
      </ACard>
    </AForm>
    <TokenModal
      v-model:visible="tokenModalVisible"
      :programme-language="model.programmeLanguage"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped>
.flex-1 {
  flex: 1 !important;
}
.code-container {
  background-color: #fcfcfc;
  border: #ecf0f1 1px solid;
  position: relative;
}
::v-deep .ant-card .ant-card-body {
  height: 100%;
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
