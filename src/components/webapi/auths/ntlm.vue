<script setup lang="ts">
import { computed } from 'vue';
import { $t, language } from '@/locales';
import { useAntdForm, useFormRules } from '@/hooks/common/form';

const { formRef } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

// 2. 定义默认模型
const model = defineModel<Api.Authorize.NtlmConfig>('model', { default: () => ({}) });

// #region 4. 定义规则类型
type RuleKey = Extract<keyof Api.Authorize.NtlmConfig, 'userame' | 'password'>;

// 根据语言动态设置 labelCol 宽度
const labelCol = language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } };

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  return {
    username: defaultRequiredRule,
    password: defaultRequiredRule
  };
});

defineExpose({
  validate: () => formRef.value?.validate(),
  reset: () => formRef.value?.resetFields()
});
</script>

<template>
  <a-form ref="formRef" :model="model" :rules="rules" :label-col="labelCol">
    <a-row :gutter="[16, 16]">
      <a-col :span="24" :md="12" :lg="12">
        <a-formItem :label="$t('page.authorize.ntlm.username')" name="username" class="m-0">
          <a-input-password v-model:value="model.username" :placeholder="$t('page.authorize.ntlm.form.username')" autocomplete="username" />
        </a-formItem>
      </a-col>
      <a-col :span="24" :md="12" :lg="12">
        <a-formItem :label="$t('page.authorize.ntlm.password')" name="password" class="m-0">
          <a-input-password v-model:value="model.password" :placeholder="$t('page.authorize.ntlm.form.password')" autocomplete="new-password" />
        </a-formItem>
      </a-col>
      <a-col :span="24" :md="12" :lg="12">
        <a-formItem :label="$t('page.authorize.ntlm.domain')" name="domain" class="m-0">
          <a-input v-model:value="model.domain" :placeholder="$t('page.authorize.ntlm.form.domain')" />
        </a-formItem>
      </a-col>
    </a-row>
  </a-form>
</template>

<style scoped></style>
