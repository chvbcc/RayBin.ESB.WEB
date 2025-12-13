<script setup lang="ts">
import { $t } from '@/locales';
import { h, nextTick, ref } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { customItemTypeOptions } from '@/constants/options';

// 创建带星号的标题
const createRequiredTitle = (title: string) => () => [
  h('span', { style: { color: '#ff4d4f', marginLeft: '4px' } }, '* '),
  title
];

const columns = [
  {
    title: createRequiredTitle($t('page.authorize.custom.name')),
    dataIndex: 'name',
    width: '25%'
  },
  {
    title: $t('page.authorize.custom.valueType'),
    dataIndex: 'valueType',
    width: 90
  },
  {
    title: createRequiredTitle($t('page.authorize.custom.value')),
    dataIndex: 'value',
    width: '25%'
  },
  {
    title: $t('page.authorize.description'),
    dataIndex: 'description',
    width: '25%'
  },
  {
    title: $t('common.operate'),
    key: 'operation',
    width: 75
  }
];

// 创建空行
const createEmptyModel = (): Api.Authorize.CustomItem => ({
  name: '',
  value: '',
  valueType: 0,
  description: ''
});

// 表单实例
const formCustomRef = ref<FormInstance>();
const model = defineModel<Api.Authorize.CustomItem[]>('model', { default: () => [] });

// 添加新行
const addRow = (index: number) => {
  model.value.splice(index + 1, 0, createEmptyModel());
  nextTick(() => {
    formCustomRef.value?.clearValidate?.(['model', index + 1]);
  });
};

// 删除行
const removeRow = (index: number) => {
  if (model.value.length > 1) {
    model.value.splice(index, 1);
    nextTick(() => {
      formCustomRef.value?.clearValidate?.();
    });
  }
};
</script>

<template>
  <a-form ref="formCustomRef" :model="model" layout="vertical">
    <a-table :data-source="model" :columns="columns" :pagination="false" row-key="idnex" :scroll="{ y: 400 }" class="editable-table">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'name'">
          <a-form-item :name="[index, 'name']" no-style :rules="[{ required: true, message: $t('page.authorize.custom.form.name') }]" :validate-trigger="['change', 'blur']" style="margin-bottom: 0">
            <a-input v-model:value="record.name" :placeholder="$t('page.authorize.custom.form.name')" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'valueType'">
          <a-form-item :name="[index, 'valueType']" no-style :rules="[{ required: true, message: $t('page.authorize.custom.form.valueType') }]" :validate-trigger="['blur']" style="margin-bottom: 0">
            <a-select v-model:value="record.valueType" :options="customItemTypeOptions" :placeholder="$t('page.authorize.custom.form.valueType')" class="w-full" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'value'">
          <a-form-item :name="[index, 'value']" no-style :rules="[{ required: true, message: $t('page.authorize.custom.form.value') }]" :validate-trigger="['change', 'blur']" style="margin-bottom: 0">
            <a-input v-model:value="record.value" :placeholder="$t('page.authorize.custom.form.value')" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'description'">
          <a-form-item :name="[index, 'description']" style="margin-bottom: 0">
            <a-input v-model:value="record.description" :placeholder="$t('page.authorize.custom.form.description')" />
          </a-form-item>
        </template>
        <template v-else-if="column.key === 'operation'">
          <div class="editable-row-operations">
            <a-button type="primary" shape="circle" size="small" class="mr-2" @click="addRow(index)">+</a-button>
            <a-button type="primary" shape="circle" size="small" :disabled="model.length <= 1" @click="removeRow(index)"> - </a-button>
          </div>
        </template>
      </template>
    </a-table>
  </a-form>
</template>

<style scoped>
.editable-table {
  margin-top: 20px;
}
.editable-row-operations {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
