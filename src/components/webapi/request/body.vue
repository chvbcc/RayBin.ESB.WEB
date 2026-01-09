<script setup lang="ts">
  import { $t } from '@/locales';
  import { ref, computed } from 'vue';
  import UrlEncoded from './parameters.vue';
  import FormData from './bodys/form-data.vue';
  import CodeEditor from './bodys/code-editor.vue';
  import SvgIcon from '@/components/custom/svg-icon.vue';

  // 使用defineModel直接管理数据
  const formRef = ref();
  const model = defineModel<Api.Task.BodyConfig>('model', { default: () => ({}) });
  const formDataRef = ref<InstanceType<typeof FormData>>();
  const urlEncodedRef = ref<InstanceType<typeof UrlEncoded>>();
  async function validate() {
    const valid = await formRef.value?.validate?.().catch(() => false);
    const validFormData = await formDataRef.value?.validate();
    const validUrlEncoded = await urlEncodedRef.value?.validate();
    if (!valid || !validFormData || !validUrlEncoded) return false;
    return true;
  }
  defineExpose({ validate, clearValidate: () => formRef.value?.clearValidate() });

  const language = computed(() => {
    switch (model.value.type) {
      case 1:
        return 'json';
      case 2:
        return 'xml';
      case 3:
        return 'html';
      default:
        return 'plaintext';
    }
  });
  const styleCodeRequired = computed(() => {
    if ([1,2,3,4].includes(model.value.type) && !model.value.raw) {
      return { borderColor: 'red' };
    }
    return {};
  });
</script>
<template>
  <a-form ref="formRef" :model="model" layout="vertical">
   <a-radio-group v-model:value="model.type">
      <a-radio :value="0">none</a-radio>
      <a-radio :value="1">json</a-radio>
      <a-radio :value="2">xml</a-radio>
      <a-radio :value="3">html</a-radio>
      <a-radio :value="4">text</a-radio>
      <a-radio :value="5">form-data</a-radio>
      <a-radio :value="6">form-urlencoded</a-radio>
    </a-radio-group>
    <div v-show="model.type === 0">
      <div class="none">
        <div class="container">
            <SvgIcon localIcon="no-data" class="icon" />
            <span class="text-nodata">{{$t('page.webApi.noBodyData')}}</span>
          </div>
      </div>
    </div>
    <div v-show="[1,2,3,4].includes(model.type)">
      <a-form-item name="raw" noStyle :rules="[{ required: [1,2,3,4].includes(model.type)}]">
        <CodeEditor ref="codeEditorRef" v-model:model="model.raw" :Language="language" :style="styleCodeRequired"></CodeEditor>
      </a-form-item>
    </div>
    <div v-show="model.type === 5">
      <FormData ref="formDataRef" v-model:model="model.formDatas"></FormData>
    </div>
    <div v-show="model.type === 6">
      <UrlEncoded ref="urlEncodedRef" v-model:model="model.urlEncodeds"></UrlEncoded>
    </div>
  </a-form>
</template>

<style scoped>
.none { width: 100%; height: 200px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; margin-top: 10px;}
.none > .container { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;}
.none > .container .icon { font-size: 5rem;}
.none > .container .nodata { font-size: 12px; color: #999;}

:deep(.ant-upload) { width: 100% !important; }
.binary { width: 100%; height: 150px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; margin-top: 10px; }
.binary > .container { width:100%; padding: 15px; }
.binary > .container button {width:100%; height: 80px; }
</style>
