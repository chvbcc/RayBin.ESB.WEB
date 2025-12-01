<script setup lang="ts">
import { computed } from 'vue';
import { $t, language } from '@/locales';
import { useAntdForm, useFormRules } from '@/hooks/common/form';

const { formRef } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

// 2. 定义默认模型
const model = defineModel<Api.Authorize.ApiKeyConfig>('model', { default: () => ({}) });

// #region 4. 定义规则类型
type RuleKey = Extract<keyof Api.Authorize.ApiKeyConfig, 'key' | 'value'>;

// 根据语言动态设置 labelCol 宽度
const labelCol = language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } };

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  return {
    key: defaultRequiredRule,
    value: defaultRequiredRule,
    in: defaultRequiredRule
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
        <a-form-item :label="$t('page.authorize.apiKey.key')" name="key" class="mt-0">
          <a-input v-model:value="model.key" :placeholder="$t('page.authorize.apiKey.form.key')" />
        </a-form-item>
      </a-col>
      <a-col :span="24" :md="12" :lg="12">
        <a-form-item :label="$t('page.authorize.apiKey.value')" name="value" class="mt-0">
          <a-input v-model:value="model.value" :placeholder="$t('page.authorize.apiKey.form.value')" />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style scoped></style>
