<script setup lang="ts">
  import { computed } from 'vue';
  import { $t, language } from '@/locales';
  import { useAntdForm, useFormRules } from '@/hooks/common/form';

  // 1. 定义默认模型
  const { formRef, validate, resetFields } = useAntdForm();
  const model = defineModel<Api.Authorize.PasswordConfig>('model', { default: () => ({}) });

  // 2. 定义验证规则
  const { defaultRequiredRule } = useFormRules();
  type RuleKey = Extract<keyof Api.Authorize.PasswordConfig, 'username' | 'password' | 'clientID'>;

  const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
    return {
      username: defaultRequiredRule,
      password: defaultRequiredRule,
      clientID: defaultRequiredRule
    };
  });

  // 3. 根据语言动态设置 labelCol 宽度
  const labelCol = language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } };

  // 4. 处理 scopes 输入
  const scopesProxy = computed({
    get: () => (model.value.scopes ?? []).join(', '),
    set: value => {
      model.value.scopes = value
        ? value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)
        : [];
    }
  });

  // 5. 暴露给父组件
  defineExpose({
    validate,
    reset: resetFields
  });
</script>

<template>
  <a-form ref="formRef" :model="model" :rules="rules" :label-col="labelCol">
    <a-row :gutter="[16, 16]">
      <a-col :span="24" :md="12" :lg="12">
        <a-form-item :label="$t('page.authorize.password.clientID')" name="clientID" class="m-0">
          <a-input v-model:value="model.clientID" :placeholder="$t('page.authorize.password.form.clientID')" autocomplete="clientID" />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12" :lg="12">
        <a-form-item :label="$t('page.authorize.password.clientSecret')" name="clientSecret" class="m-0">
          <a-input v-model:value="model.clientSecret" :placeholder="$t('page.authorize.password.form.clientSecret')" autocomplete="clientSecret" />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12" :lg="12">
        <a-form-item :label="$t('page.authorize.password.username')" name="username" class="m-0">
          <a-input v-model:value="model.username" :placeholder="$t('page.authorize.password.form.username')" autocomplete="username" />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12" :lg="12">
        <a-form-item :label="$t('page.authorize.password.password')" name="password" class="m-0">
          <a-input-password v-model:value="model.password" :placeholder="$t('page.authorize.password.form.password')" autocomplete="new-password" />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12" :lg="12">
        <a-form-item :label="$t('page.authorize.password.scopes')" name="scopes" class="m-0">
          <a-input v-model:value="scopesProxy" :placeholder="$t('page.authorize.password.form.scopes')" autocomplete="scopes" />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style scoped></style>
