<script setup lang="ts">
import { $t } from '@/locales';
import { useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { translateOptions } from '@/utils/common';
import CustomAlert from '@/components/custom/custom-alert.vue';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { testConnection, checkConnectionName } from '@/service/api';
import { databaseTypeOptions, connectionModeOptions } from '@/constants/business';
import { parseConnectionString, parseConnectionModel, getConnectionStringByType } from '@/views/common/connection';
import { isNull } from 'util';

const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

const connectionMode = ref<string>('0');
const { formRef } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

// 0. 控制alert显示/隐藏的状态
const showAlert = ref(false);
const type = ref<'error' | 'success' | 'warning' | 'info'>('success');
const message = ref<string>('');
const description = ref<string>('');

// 1. 添加计算属性，根据connectionMode控制字段禁用状态
const isCustomMode = computed(() => connectionMode.value === '0');
const isConnectionStringMode = computed(() => connectionMode.value === '1');

// 2. 定义默认模型
const model = ref(createDefaultModel());

function createDefaultModel(): Api.ConnectionTypes.ConnectionModel {
  return {
    id: 0,
    connectionName: '',
    databaseType: '1',
    hostName: '127.0.0.1',
    port: 3306,
    databases: 'myDB',
    userName: 'root',
    password: 'Pwd@123',
    connectionString: 'Server=127.0.0.1;Database=myDB;Uid=root;Pwd=Pwd@123;Port=3306;'
  };
}

// 3. 定义规则类型
type RuleKey = Extract<keyof Api.ConnectionTypes.ConnectionModel, 'connectionName' | 'databaseType' | 'hostName' | 'port' | 'databases' | 'userName' | 'password' | 'connectionString'>;

// 4. 将rules改为计算属性，根据连接模式动态调整必填字段
const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  // connectionName blur 时触发后端验证
  const connectionNameRule: App.Global.FormRule = {
    validateTrigger: 'blur',
    validator: async (_rule: any, value: string) => {
      const name = (value ?? '').trim();
      if (!name) {
        return Promise.reject(new Error(($t('page.connection.form.connectionName') as string)));
      }

      const createUserId = parseInt(authStore.userInfo.userId) ?? 0;
      const { response } = await checkConnectionName(name, createUserId, model.value.id);
      const data = response.data as { code: string; msg: string; data: boolean };
      if (data.msg==="success" && data.data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    }
  };

  // 其余字段保持默认必填规则
  return {
    connectionName: connectionNameRule,
    databaseType: defaultRequiredRule,
    hostName: defaultRequiredRule,
    port: defaultRequiredRule,
    databases: defaultRequiredRule,
    userName: defaultRequiredRule,
    password: defaultRequiredRule,
    connectionString: defaultRequiredRule
  };
});


// 5. 添加数据库类型变化的watch监听
watch(() => model.value.databaseType, (newType) => {
    getConnectionStringByType(newType, model.value);
    parseConnectionString(model.value);
});

// 6. 添加连接字符串变化的watch监听
watch(() => [
    model.value.hostName,
    model.value.port,
    model.value.databases,
    model.value.userName,
    model.value.password,
    model.value.connectionString
  ],
  () => {
    if (connectionMode.value === '0') {
      parseConnectionModel(model.value);
    } else if (connectionMode.value === '1') {
      parseConnectionString(model.value);
    }
  }
);

// 7. 关闭alert的处理函数
const handleCloseAlert = () => {
  showAlert.value = false;
};

// 8. 测试连接
async function handleTestConnection() {
  const { response } = await testConnection(model.value);
  const data = response.data as { code: string; msg: string; data: string };
  if (data.msg === "fail") {
      message.value =  $t('common.fail')
      description.value = data.data
      type.value = 'error';
  }
  else if (data.msg === "success") {
    message.value = $t('common.success');
    description.value = $t('page.connection.connectionSuccess');
    type.value = 'success';
  }
  showAlert.value = true;
}

// 9. 保存连接
function handleSave()  {
  formRef.value?.validate().then(() => {
    // saveConnection(model.value);
  }).catch(() => {
    return;
  });
}

// 10. 返回
function handleBack() {
  appStore.tabStore.removeActiveTab();
  router.push({ name: 'connection' });
}
</script>

<template>
    <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <a-card :title="$t('page.connection.title')" :bordered="false" class="card-wrapper sm:flex-1-hidden">
        <a-form ref="formRef" :model="model" :rules="rules" :label-col="{ span: 6 }">
          <a-row :gutter="[16, 16]">
            <a-col :span="18">
              <a-form-item :label="$t('page.connection.connectionMode')" name="databaseType" class="m-2">
                <a-radio-group v-model:value="connectionMode" option-type="button" :options="translateOptions(connectionModeOptions)" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item :label="$t('page.connection.databaseType')" name="databaseType" class="m-2">
                <a-select v-model:value="model.databaseType" :placeholder="$t('page.connection.form.databaseType')" :options="translateOptions(databaseTypeOptions)" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item :label="$t('page.connection.connectionName')" name="connectionName" class="m-2">
                <a-input v-model:value="model.connectionName" :placeholder="$t('page.connection.form.connectionName')" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item :label="$t('page.connection.hostName')" name="hostName" class="m-2">
                <a-input v-model:value="model.hostName" :placeholder="$t('page.connection.form.hostName')" :disabled="isConnectionStringMode" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item :label="$t('page.connection.port')" name="port" class="m-2">
                <a-input-number v-model:value="model.port" :placeholder="$t('page.connection.form.port')" :disabled="isConnectionStringMode" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item :label="$t('page.connection.databases')" name="databases" class="m-2">
                <a-input v-model:value="model.databases" :placeholder="$t('page.connection.form.databases')" :disabled="isConnectionStringMode" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item :label="$t('page.connection.userName')" name="userName" class="m-2">
                <a-input v-model:value="model.userName" :placeholder="$t('page.connection.form.userName')" :disabled="isConnectionStringMode" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item :label="$t('page.connection.password')" name="password" class="m-2">
                <a-input-password v-model:value="model.password" :placeholder="$t('page.connection.form.password')" :disabled="isConnectionStringMode" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item :label="$t('page.connection.connectionString')" name="connectionString" class="m-2">
                <a-textarea v-model:value="model.connectionString" :placeholder="$t('page.connection.form.connectionString')" :disabled="isCustomMode" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item :label-col="{ span: 6 }" label="&nbsp;" :colon="false" class="m-2">
                <a-button type="primary" @click="handleTestConnection" class="orange-btn mr-8 pl-6 pr-6">
                  {{$t('common.test')}}
                </a-button>
                <a-button type="primary" @click="handleSave" class="blue-btn mr-8  pl-6 pr-6">
                  {{$t('common.save')}}
                </a-button>
                <a-button type="primary" @click="handleBack" ghost class=" pl-6 pr-6">
                  {{$t('common.back')}}
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      <CustomAlert v-if="showAlert"  :message="message" :type="type" :description="description" show-icon closable @close="handleCloseAlert" />
    </div>
</template>

<style scoped></style>
