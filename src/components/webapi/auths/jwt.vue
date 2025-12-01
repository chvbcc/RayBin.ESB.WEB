<script setup lang="ts">
import { computed } from 'vue';
import { $t, language } from '@/locales';
import { convertOptions } from '@/utils/common';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { algorithmOptions, yesOrNoOptions } from '@/constants/options';

const { formRef } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

// 2. 定义默认模型
const model = defineModel<Api.Authorize.JwtConfig>('model', { default: () => ({}) });

// #region 4. 定义规则类型
type RuleKey = Extract<keyof Api.Authorize.JwtConfig, 'algorithm' | 'secret' | 'payload'>;

// 根据语言动态设置 labelCol 宽度
const labelCol = language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } };

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  return {
    algorithm: defaultRequiredRule,
    secret: defaultRequiredRule,
    payload: defaultRequiredRule
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
        <a-form-item :label="$t('page.authorize.jwt.algorithm')" name="algorithm" class="m-0">
          <a-select v-model:value="model.algorithm" :placeholder="$t('page.authorize.jwt.form.algorithm')" :options="algorithmOptions" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12" :lg="12">
        <a-form-item :label="$t('page.authorize.jwt.secret')" name="secret" class="m-0">
          <a-input v-model:value="model.secret" :placeholder="$t('page.authorize.jwt.form.secret')" autocomplete="secret" />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12" :lg="12">
        <a-form-item :label="$t('page.authorize.jwt.isSecretBase')" name="isSecretBase" class="m-0">
          <a-select
            v-model:value="model.isSecretBase" :placeholder="$t('page.authorize.jwt.form.isSecretBase')" :options="convertOptions(yesOrNoOptions)" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12" :lg="12">
        <a-form-item :label="$t('page.authorize.jwt.payload')" name="payload" class="m-0">
          <a-input v-model:value="model.payload" :placeholder="$t('page.authorize.jwt.form.payload')" autocomplete="payload" />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style scoped></style>
