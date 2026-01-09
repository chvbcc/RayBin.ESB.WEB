<script setup lang="ts">
  import { $t } from '@/locales';
  import { h, nextTick, ref, computed } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { contentTypeOptions } from '@/constants/options';

    // 创建带星号的标题
  const createRequiredTitle = (title: string) => () => [
    h('span', { style: { color: '#ff4d4f', marginLeft: '4px' } }, '* '),
    title
  ];

  const columns = computed(() => [
    {
      title: createRequiredTitle($t('page.webApi.paramName')),
      dataIndex: 'name',
      width: '25%'
    },
    {
      title: createRequiredTitle($t('page.webApi.paramValue')),
      dataIndex: 'value',
      width: '25%'
    },
    {
      title: $t('page.webApi.contentType'),
      dataIndex: 'contentType',
      width: '25%'
    },
    {
      title: $t('page.webApi.uploadFile'),
      dataIndex: 'filePath',
      width: '23%'
    },
    {
      title: $t('common.operate'),
      key: 'operation',
      width: 75
    }
  ]);

  const createEmptyModel = (): Api.Task.FormData => ({
    name: '',
    value: '',
    isFile: false,
    filePath: '',
    contentType: ''
  });

  // 表单实例
  const formRef = ref<FormInstance>();
  // 使用defineModel直接管理数据
  const model = defineModel<Api.Task.FormData[]>('model', { default: () => [] });

  // 组件内校验
  async function validate() {
    const valid = await formRef.value?.validate?.().catch(() => false);
    if (!valid) return false;
    return true;
  }
  defineExpose({ validate });

  // 添加新行
  const addRow = (index: number) => {
    model.value.splice(index + 1, 0, createEmptyModel());
    nextTick(() => { formRef.value?.clearValidate?.(['model', index + 1]); });
  };

  // 删除行
  const removeRow = (index: number) => {
    if (model.value.length > 1) {
      model.value.splice(index, 1);
      nextTick(() => { formRef.value?.clearValidate?.(); });
    }
  };

  // 上传前检查文件
  const beforeUpload = (file: File, record: Api.Task.FormData) => {
    const fullPath = file.webkitRelativePath || (file as any).path || file.name;
    record.filePath = fullPath;
    record.value = file.name;
    record.isFile = true;
    record.contentType = file.type || 'application/octet-stream';
    return false;
  };

  // 移除文件
  const removeFile = (record: Api.Task.FormData) => {
    record.value = '';
    record.filePath = '';
    record.isFile = false;
    record.contentType = '';
  };
</script>

<template>
  <a-form ref="formRef" :model="model" layout="vertical">
    <a-table :data-source="model" :columns="columns" :pagination="false" :scroll="{ y: 400 }" row-key="index" class="editable-table">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'name'">
          <a-form-item :name="[index, 'name']" no-style :rules="[{ required: (record.value !== '' || record.contentType !== '') }]" :validate-trigger="['change', 'blur']">
            <a-input v-model:value="record.name" :placeholder="$t('page.webApi.form.paramName')"  class="w-full" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'value'">
            <a-form-item :name="[index, 'value']" no-style :rules="[{ required: (record.name !== '' || record.contentType !== '') }]" :validate-trigger="['change', 'blur']">
              <a-input v-model:value="record.value" :placeholder="$t('page.webApi.form.paramValue')" :disabled="record.isFile" />
            </a-form-item>
          </template>
        <template v-else-if="column.dataIndex === 'contentType'">
          <a-form-item :name="[index, 'contentType']" no-style :rules="[{ required: (record.name !== '' || record.value !== '') }]" :validate-trigger="['change', 'blur']">
            <a-auto-complete v-model:value="record.contentType" :options="contentTypeOptions" :placeholder="$t('page.webApi.form.contentType')" :filter-Option="true" class="w-full" :disabled="record.isFile" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'filePath'">
          <a-form-item :name="[index, 'filePath']" no-style>
            <div v-if="record.filePath" class="flex items-center">
              <span class="mr-2">{{ record.filePath }}</span>
              <a-button type="link" @click="removeFile(record as Api.Task.FormData)">{{ $t('common.delete') }}</a-button>
            </div>
            <a-upload v-else :before-upload="(file) => beforeUpload(file, record as Api.Task.FormData)" :max-count="1" :show-upload-list="false" >
              <a-button><UploadOutlined />{{ $t('page.webApi.form.uploadFile') }}</a-button>
            </a-upload>
          </a-form-item>
        </template>
        <template v-else-if="column.key === 'operation'">
          <div class="editable-row-operations">
            <a-button type="primary" shape="circle" size="small" @click="addRow(index)" class="mr-2"> + </a-button>
            <a-button type="primary" shape="circle" size="small" @click="removeRow(index)" :disabled="model.length <= 1"> - </a-button>
          </div>
        </template>
      </template>
    </a-table>
  </a-form>
</template>

<style scoped>
.editable-table { margin-top: 20px; }
.editable-row-operations { display: flex; justify-content: center; align-items: center; }
</style>
