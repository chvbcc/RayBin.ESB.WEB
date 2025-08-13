<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { databaseTypeOptions, connectionModeOptions } from '@/constants/business';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';
import { parseConnectionString, generateConnectionStringByType } from '@/views/common/connection';

const connectionMode = ref<string>('0');
const { formRef } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

// 1. 添加计算属性，根据connectionMode控制字段禁用状态
const isCustomMode = computed(() => connectionMode.value === '0');
const isConnectionStringMode = computed(() => connectionMode.value === '1');

// 2. 定义默认模型
const model = ref(createDefaultModel());

function createDefaultModel(): Api.ConnectionTypes.ConnectionModel {
  return {
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

// 4. 定义规则类型
type RuleKey = Extract<keyof Api.ConnectionTypes.ConnectionModel, 'connectionName' | 'databaseType' | 'hostName' | 'port' | 'databases' | 'userName' | 'password' | 'connectionString'>;

// 5. 将rules改为计算属性，根据连接模式动态调整必填字段
const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const baseRules: Record<RuleKey, App.Global.FormRule> = {
    connectionName: defaultRequiredRule,
    databaseType: defaultRequiredRule,
    hostName: isConnectionStringMode.value ? {} : defaultRequiredRule,
    port: isConnectionStringMode.value ? {} : defaultRequiredRule,
    databases: isConnectionStringMode.value ? {} : defaultRequiredRule,
    userName: isConnectionStringMode.value ? {} : defaultRequiredRule,
    password: isConnectionStringMode.value ? {} : defaultRequiredRule,
    connectionString: isCustomMode.value ? {} : defaultRequiredRule
  };
  return baseRules;
});

// 6. 添加连接字符串变化的watch监听
watch(() => model.value.connectionString, (newValue) => {
  if (connectionMode.value === '1') {
    const parsedData = parseConnectionString(model.value.databaseType, newValue);
    Object.assign(model.value, parsedData);
  }
});

// 7. 添加数据库类型变化的watch监听
watch(() => model.value.databaseType, (newType) => {
    generateConnectionStringByType(newType, model.value);
    const parsedData = parseConnectionString(newType, model.value.connectionString);
    Object.assign(model.value, parsedData);
});

function handleTestConnection() {

}

function handleSave()  {

}

function handleBack() {

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
              <a-form-item label="用户名" name="userName" class="m-2">
                <a-input v-model:value="model.userName" placeholder="请输入用户名" :disabled="isConnectionStringMode" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="密码" name="password" class="m-2">
                <a-input-password v-model:value="model.password" placeholder="请输入密码" :disabled="isConnectionStringMode" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="连接字符串" name="connectionString" class="m-2">
                <a-textarea v-model:value="model.connectionString" placeholder="请输入连接字符串" :disabled="isCustomMode" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item :label-col="{ span: 6 }" label="&nbsp;" :colon="false" class="m-2">
                <a-button type="primary" @click="handleTestConnection" class="orange-btn mr-8">测试</a-button>
                <a-button type="primary" @click="handleSave" class="mr-8">保存</a-button>
                <a-button type="primary" @click="handleBack">返回</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </div>
</template>

<style scoped></style>
