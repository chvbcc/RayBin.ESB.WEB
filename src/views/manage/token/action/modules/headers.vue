
<script setup lang="ts">
import { $t } from '@/locales';
import type { FormInstance } from 'ant-design-vue';
import { h, nextTick, reactive, ref, watch, useId } from 'vue';
import { paramTypeOptions, paramNameOptions } from '@/constants/token';

// 表格列定义
type ParamRow = Api.Token.Param & { key: string };

const paramsModel = defineModel<Api.Token.Param[]>({
  default: () => []
});

// 创建带星号的标题
const createRequiredTitle = (title: string) => () => [
  h('span', { style: { color: '#ff4d4f', marginLeft: '4px' } }, '* '),
  title
];

const columns = [
  {
    title: createRequiredTitle($t('page.httpRequest.paramName')),
    dataIndex: 'name',
    width: '25%'
  },
  {
    title: $t('page.httpRequest.paramType'),
    dataIndex: 'valueType',
    width: 90
  },
  {
    title: createRequiredTitle($t('page.httpRequest.paramValue')),
    dataIndex: 'value',
    width: '25%'
  },
  {
    title: $t('page.httpRequest.description'),
    dataIndex: 'description',
    width: '25%'
  },
  {
    title: $t('common.operate'),
    key: 'operation',
    width: 120
  }
];

const createEmptyRow = (): ParamRow => ({
  key: `${useId()}`,
  name: '',
  value: '',
  valueType: 'String',
  description: ''
});

const formRef = ref<FormInstance>();
const formModel = reactive<{ rows: ParamRow[] }>({ rows: [createEmptyRow()] });


let syncingFromModel = false;

const syncModel = () => {
  if (syncingFromModel) return;
  paramsModel.value = formModel.rows.map(({ key, ...rest }) => ({ ...rest }));
};

watch(
  () => paramsModel.value,
  newParams => {
    syncingFromModel = true;
    const source = Array.isArray(newParams) && newParams.length > 0 ? newParams : [createEmptyRow()];
    formModel.rows = source.map(item => ({
      key: `${useId()}`,
      name: item.name || '',
      value: item.value || '',
      valueType: item.valueType ?? 'String',
      description: item.description || ''
    }));
    nextTick(() => {
      syncingFromModel = false;
      formRef.value?.clearValidate?.();
    });
  },
  { immediate: true, deep: true }
);

watch(
  () => formModel.rows,
  () => {
    syncModel();
  },
  { deep: true }
);


// 添加新行
const addRow = (index: number) => {
  formModel.rows.splice(index + 1, 0, createEmptyRow());
};

// 删除行
const removeRow = (index: number) => {
  if (formModel.rows.length > 1) {
    formModel.rows.splice(index, 1);
  }
};

async function validateParams() {
  if (!formRef.value) return true;
  try {
    await formRef.value.validate();
    return true;
  } catch (error) {
    return false;
  }
}

function getParams(): Api.Token.Param[] {
  return formModel.rows.map(({ key, ...rest }) => ({ ...rest }));
}

defineExpose({
  validateParams,
  getParams
});
</script>

<template>
  <a-form ref="formRef" :model="formModel" layout="vertical">
    <a-table :data-source="formModel.rows" :columns="columns" :pagination="false" :scroll="{ y: 400 }" row-key="key" class="editable-table">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'name'">
          <a-form-item :name="['rows', index, 'name']" no-style :rules="[{ required: true }]" :validate-trigger="['change', 'blur']">
            <a-auto-complete v-model:value="record.name" :options="paramNameOptions" :placeholder="$t('page.httpRequest.form.paramName')"  filter-Option="true" class="w-full" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'valueType'">
          <a-form-item :name="['rows', index, 'valueType']" no-style :rules="[{ required: true }]" :validate-trigger="['change']">
            <a-select v-model:value="record.valueType" :options="paramTypeOptions" :placeholder="$t('page.httpRequest.form.paramType')" class="w-full" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'value'">
          <a-form-item :name="['rows', index, 'value']" no-style :rules="[{ required: true }]" :validate-trigger="['change', 'blur']">
            <a-input v-model:value="record.value" :placeholder="$t('page.httpRequest.form.paramValue')" />
          </a-form-item>
        </template>
        <template v-else-if="column.dataIndex === 'description'">
          <a-form-item :name="['rows', index, 'description']">
            <a-input v-model:value="record.description" :placeholder="$t('page.httpRequest.form.description')" />
          </a-form-item>
        </template>
        <template v-else-if="column.key === 'operation'">
          <div class="editable-row-operations">
            <a-button type="primary" shape="circle" size="small" @click="addRow(index)" class="mr-2"> + </a-button>
            <a-button type="primary" shape="circle" size="small" @click="removeRow(index)" :disabled="formModel.rows.length <= 1"> - </a-button>
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
