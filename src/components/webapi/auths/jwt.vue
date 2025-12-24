<script setup lang="ts">
  import { computed } from 'vue';
  import { $t, language } from '@/locales';
  import { convertOptions } from '@/utils/common';
  import { useAntdForm, useFormRules } from '@/hooks/common/form';
  import { algorithmOptions, yesOrNoOptions } from '@/constants/options';

  // 1. 定义默认模型
  const { validate, resetFields } = useAntdForm();
  const model = defineModel<Api.Authorize.JwtConfig>('model', { default: () => ({}) });

  // 2. 定义验证规则
  const { defaultRequiredRule } = useFormRules();
  type RuleKey = Extract<keyof Api.Authorize.JwtConfig, 'algorithm' | 'secret' | 'payload'>;

  const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
    return {
      algorithm: defaultRequiredRule,
      secret: defaultRequiredRule,
      payload: defaultRequiredRule
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
