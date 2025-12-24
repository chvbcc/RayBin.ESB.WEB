<script setup lang="ts">
  import { computed } from 'vue';
  import { $t, language } from '@/locales';
  import { useAntdForm, useFormRules } from '@/hooks/common/form';

  // 1. 定义默认模型
  const { validate, resetFields } = useAntdForm();
  const model = defineModel<Api.Authorize.ApiKeyConfig>('model', { default: () => ({}) });

  // 2. 定义验证规则
  const { defaultRequiredRule } = useFormRules();
  type RuleKey = Extract<keyof Api.Authorize.ApiKeyConfig, 'key' | 'value'>;

  const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
    return {
      key: defaultRequiredRule,
      value: defaultRequiredRule,
      in: defaultRequiredRule
    };
  });

  // 3. 根据语言动态设置 labelCol 宽度
  const labelCol = language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } };

  // 4. 暴露给父组件的方法
  defineExpose({
    validate,
    reset: resetFields
  });
</script>

<template>
  <a-form :model="model" :rules="rules" :label-col="labelCol">
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
