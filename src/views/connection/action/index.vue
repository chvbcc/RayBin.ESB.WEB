<script setup lang="tsx">
import { $t } from '@/locales';
import { onMounted } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { translateOptions, getPromptMessage } from '@/utils/common';
import CustomAlert from '@/components/custom/custom-alert.vue';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import type { RadioChangeEvent } from 'ant-design-vue';
import { connectionModeOptions } from '@/constants/options';
import { fetchTest, fetchCheckName, fetchSave, fetchGetModel } from '@/service/api/connection';
import { parseConnectionString, parseConnectionModel, getConnectionStringByType } from '@/views/common/connection';

// #region 1. 定义常量

// 数据库类型绑定值
interface DatabaseTypeOption {
  label: string;       // 数据库名称
  value: string;       // 绑定值（如库名缩写）
  logo: string;        // 图片地址（建议使用 require 或 CDN）
}

// 数据源与后台一致
const dbList: DatabaseTypeOption[] = [
  { label: 'MySQL', value: '0', logo: '../../src/assets/imgs/mysql.png' },
  { label: 'PostgreSQL', value: '1', logo: '../../src/assets/imgs/postgresql.png' },
  { label: 'Oracle', value: '2', logo: '../../src/assets/imgs/oracle.png' },
  { label: 'SQL Server', value: '3', logo: '../../src/assets/imgs/sqlserver.png' },
  { label: 'SAP HANA', value: '4', logo: '../../src/assets/imgs/hana.png' },
  { label: 'PolarDB', value: '5', logo: '../../src/assets/imgs/polardb.png' },
  { label: 'GoldenDB', value: '6', logo: '../../src/assets/imgs/goldendb.png' },
  { label: 'TiDB', value: '7', logo: '../../src/assets/imgs/tidb.png' },
  { label: 'OceanBase', value: '8', logo: '../../src/assets/imgs/oceanbase.png' },
  { label: 'DaMeng', value: '9', logo: '../../src/assets/imgs/dameng.png' },
  { label: 'OpenGauss', value: '10', logo: '../../src/assets/imgs/opengauss.png' },
  { label: 'KingBase', value: '11', logo: '../../src/assets/imgs/kingbase.png' },
];

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

const connectionMode = ref<string>('0');
const { formRef } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

// 控制alert显示/隐藏的状态
const showAlert = ref(false);
const type = ref<'error' | 'success' | 'warning' | 'info'>('success');
const message = ref<string>('');
const description = ref<string>('');

// 添加计算属性，根据connectionMode控制字段禁用状态
const isCustomMode = computed(() => connectionMode.value === '0');
const isConnectionStringMode = computed(() => connectionMode.value === '1');
//#endregion

// #region 2. 定义默认模型创建模型默认值
const model = ref<Api.Connection.ConnectionModel>(createDefaultModel());
function createDefaultModel(): Api.Connection.ConnectionModel {
  return {
    id: 0,
    connectionName: '',
    databaseType: '0',
    hostName: '127.0.0.1',
    port: 3306,
    databases: 'myDB',
    username: 'root',
    password: 'Pwd@123',
    connectionString: 'Server=127.0.0.1;Database=myDB;Uid=root;Pwd=Pwd@123;Port=3306;'
  };
}
//#endregion

// #region 3. 组件加载后，根据id值判断是添加还是编辑
onMounted(async () => {
  const id = Number(route.query.id ?? 0);
  if (id) {
    const { error, data } = await fetchGetModel(id);
    if (!error && data) {
      model.value = { ...createDefaultModel(), ...data };
    }
  }
});
//#endregion

// #region 4. 定义规则类型
type RuleKey = Extract<keyof Api.Connection.ConnectionModel, 'connectionName' | 'databaseType' | 'hostName' | 'port' | 'databases' | 'userName' | 'password' | 'connectionString'>;

// 6. 将rules改为计算属性，根据连接模式动态调整必填字段
const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const connectionNameRule: App.Global.FormRule = {
    required: true, // 添加 required: true，确保显示星号
    validateTrigger: 'blur',
    validator: async (_rule: any, value: string) => {
      const name = (value ?? '').trim();
      if (!name) {
        return Promise.reject(new Error(($t('page.connection.form.connectionName') as string)));
      }
      const createUserId = parseInt(authStore.userInfo.userId) ?? 0;
      const { response } = await fetchCheckName(name, createUserId, model.value.id);
      const data = response.data as { code: string; msg: string; data: boolean };
      if (data.msg === 'success' && data.data) {
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
//#endregion

// #region 5. 添加数据库类型变化的watch监听
const handleDatabaseTypeChange = (e: RadioChangeEvent) => {
  const value = e.target.value;
  const databaseType = typeof value === 'string' ? value : String(value ?? '');
  console.log('databaseType', databaseType);
  getConnectionStringByType(databaseType, model.value);
  parseConnectionString(model.value);
};
//#endregion

// #region 6. 添加连接字符串变化的watch监听
watch(() => [
    model.value.hostName,
    model.value.port,
    model.value.databases,
    model.value.username,
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
//#endregion

// #region 7. 关闭alert的处理函数
const handleCloseAlert = () => {
  showAlert.value = false;
};
//#endregion

// #region 8. 测试连接
async function handleTestConnection() {
  const { response } = await fetchTest(model.value);
  const data = response.data as { code: string; msg: string; data: string };
  if (data.msg === 'fail') {
    message.value = $t('common.fail');
    description.value = data.data;
    type.value = 'error';
  } else if (data.msg === 'success') {
    message.value = $t('common.success');
    description.value = $t('page.connection.connectionSuccess');
    type.value = 'success';
  }
  showAlert.value = true;
}
//#endregion

// #region 9. 保存连接
async function handleSave() {
  formRef.value?.validate().then(async () => {
    const { error, response } = await fetchTest(model.value);
    if (error) { window.$message?.error($t('common.fail')); return; }
    const result = response.data as { code: string; msg: string; data: string };
    if (result.msg === "fail") {
      message.value =  $t('common.fail')
      description.value = result.data
      type.value = 'error';
      showAlert.value = true;
    }
    else if (result.msg === "success") {
      const { error, response } = await fetchSave(model.value);
      if (error) { window.$message?.error($t('common.addFailed')); return; }
      const result = response.data as { code: string; msg: string; data: string};
      if (result.msg === "success") {
        window.$message?.success(getPromptMessage(route.query, "Success"));
        appStore.tabStore.removeActiveTab();
        router.push({ name: 'connection' });
      }
      else if (result.msg === "fail") {
        window.$message?.error(result.data);
      } else {
        window.$message?.error(getPromptMessage(route.query, "Failed"));
      }
    }
  }).catch(() => {
    return;
  });
}
//#endregion

// #region 10. 返回连接列表
function handleBack() {
  appStore.tabStore.removeActiveTab();
  router.push({ name: 'connection' });
}
//#endregion
</script>

<template>
    <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <a-form ref="formRef" :model="model" :rules="rules" :label-col="{ span: 4 }">
        <a-card :title="$t('page.connection.databaseType')" :bordered="false" class="card-wrapper sm:flex-1-hidden">
          <a-radio-group v-model:value="model.databaseType" @change="handleDatabaseTypeChange">
            <div class="db-grid-container">
              <a-radio-button v-for="item in dbList" :key="item.value" :value="item.value" class="img-radio-btn">
                <div class="img-container">
                  <img :src="item.logo" alt="item.label" :class="{ active: model.databaseType === item.value }" />
                </div>
              </a-radio-button>
            </div>
          </a-radio-group>
        </a-card>
        <a-card :title="$t('page.connection.connectionConfig')" :bordered="false" class="card-wrapper">
          <a-row :gutter="[16, 16]" style="max-width: 1050px;">
              <a-col :span="24">
                <a-form-item :label="$t('page.connection.connectionMode')" name="databaseType" class="m-2">
                  <a-radio-group v-model:value="connectionMode" option-type="button" :options="translateOptions(connectionModeOptions)" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item :label="$t('page.connection.connectionName')" name="connectionName" class="m-2">
                  <a-input v-model:value="model.connectionName" :placeholder="$t('page.connection.form.connectionName')" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <div class="flex">
                  <a-form-item :label="$t('page.connection.hostName')" name="hostName" :label-col="{ style: { width: '168px' } }" class="m-2">
                    <a-input v-model:value="model.hostName" :placeholder="$t('page.connection.form.hostName')" :disabled="isConnectionStringMode" style="width: 641px;" />
                  </a-form-item>
                  <a-form-item :label="$t('page.connection.port')" name="port" :label-col="{ style: { width: '100px' } }" class="m-2">
                    <a-input-number v-model:value="model.port" :placeholder="$t('page.connection.form.port')" :disabled="isConnectionStringMode" />
                  </a-form-item>
                </div>
              </a-col>
              <a-col :span="24">
                <a-form-item :label="$t('page.connection.databases')" name="databases" class="m-2">
                  <a-input v-model:value="model.databases" :placeholder="$t('page.connection.form.databases')" :disabled="isConnectionStringMode" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item :label="$t('page.connection.username')" name="username" class="m-2">
                  <a-input v-model:value="model.username" :placeholder="$t('page.connection.form.username')" :disabled="isConnectionStringMode" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item :label="$t('page.connection.password')" name="password" class="m-2">
                  <a-input-password v-model:value="model.password" :placeholder="$t('page.connection.form.password')" :disabled="isConnectionStringMode" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item :label="$t('page.connection.connectionString')" name="connectionString" class="m-2">
                  <a-textarea v-model:value="model.connectionString" :placeholder="$t('page.connection.form.connectionString')" :disabled="isCustomMode" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
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
        </a-card>
      </a-form>
      <CustomAlert v-if="showAlert"  :message="message" :type="type" :description="description" show-icon closable @close="handleCloseAlert" />
    </div>
</template>

<style scoped>
  /* CSS Grid 一行4列布局 小屏幕一行2列 更小的屏幕一行1列*/
  .db-grid-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; width: 100%; padding: 16px;}
  @media (max-width: 768px) { .db-grid-container { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 580px) { .db-grid-container { grid-template-columns: 1fr; } }

  /* 单个数据库按钮样式 */
  .img-radio-btn {
    border: 1px solid #d9d9d9 !important;
    background: white !important;
    padding: 16px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    width: 250px;
    height: 50px;
    min-height: 60px;
    aspect-ratio: 1 / 1;
  }


  /* 悬停效果 - 只将左侧边框设为 2px */
  .db-grid-container :deep(.ant-radio-button-wrapper:hover) {
    box-shadow: 0 0 0 1px #1890ff inset, 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  }

  /* 选中状态 */
  .db-grid-container :deep(.ant-radio-button-wrapper-checked) {
    border: 1px solid #1890ff !important;
    box-shadow: 0 0 0 0 inset, 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  }

  .img-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 93%; height: 93%; left: 10px; }
  .img-container img { max-width: 96%; max-height: 96%; object-fit: contain; transition: all 0.2s ease; left: 10px; }

  /* 选中时图片变亮并放大 */
  .img-container img.active { opacity: 1; transform: scale(1.2); }
  .card-wrapper { margin-bottom: 16px; }

</style>
