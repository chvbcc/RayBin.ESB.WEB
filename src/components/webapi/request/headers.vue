<script setup lang="ts">
  import { $t } from '@/locales';
  import { h, nextTick, ref, computed } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { paramTypeOptions, paramNameOptions } from '@/constants/options';

  // 创建带星号的标题
  const createRequiredTitle = (title: string) => () => [
    h('span', { style: { color: '#ff4d4f', marginLeft: '4px' } }, '* '),
    title
  ];

  // 表格列定义
  const columns = computed(() => [
    {
      title: createRequiredTitle($t('page.webApi.paramName')),
      dataIndex: 'name',
      width: '25%'
    },
    {
      title: $t('page.webApi.paramType'),
      dataIndex: 'valueType',
      width: 90
    },
    {
      title: createRequiredTitle($t('page.webApi.paramValue')),
      dataIndex: 'value',
      width: '25%'
    },
    {
      title: $t('page.webApi.description'),
      dataIndex: 'description',
      width: '25%'
    },
    {
      title: $t('common.operate'),
      key: 'operation',
      width: 75
    }
  ]);

  // 创建空行
  const createEmptyModel = (): Api.Task.Param => ({
    name: '',
    value: '',
    valueType: 0,
    description: ''
  });

  // 表单实例
  const formRef = ref<FormInstance>();
  // 使用defineModel直接管理数据
  const model = defineModel<Api.Task.Param[]>('model', {  default: () => []});

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
</script>

<template>
  <a-form ref="formRef":model="model" layout="vertical">
    <a-table :data-source="model" :columns="columns" :pagination="false" :scroll="{ y: 310 }" row-key="index" class="editable-table">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'name'">
          <a-form-item :name="[index, 'name']" no-style :validate-trigger="['change', 'blur']" :rules="[{ required: (record.value !== '' || record.valueType !== 0 || record.description !== '') }]">
            <a-auto-complete v-model:value="record.name" :options="paramNameOptions" :placeholder="$t('page.webApi.form.paramName')" :filter-option="true" class="w-full" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'valueType'">
          <a-form-item :name="[index, 'valueType']" no-style :validate-trigger="['change', 'blur']" :rules="[{ required: (record.name !== '' || record.value !== '' || record.description !== '') }]">
            <a-select v-model:value="record.valueType" :options="paramTypeOptions" :placeholder="$t('page.webApi.form.paramType')" class="w-full" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'value'">
          <a-form-item :name="[index, 'value']" no-style :validate-trigger="['change', 'blur']" :rules="[{ required: (record.name !== '' || record.valueType !== 0 || record.description !== '') }]">
            <a-input v-model:value="record.value" :placeholder="$t('page.webApi.form.paramValue')" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'description'">
          <a-form-item :name="[index, 'description']" no-style>
            <a-input v-model:value="record.description" :placeholder="$t('page.webApi.form.description')" />
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
.editable-table { padding: 0; }
.editable-row-operations { display: flex; justify-content: center; align-items: center; }
</style>
