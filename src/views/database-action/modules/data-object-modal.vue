<script setup lang="ts">
import { $t } from '@/locales';
import { computed, ref, watch } from 'vue';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { fetchGetTableList, fetchGetViewList, fetchGetStoredProcedureList } from '@/service/api/database';

defineOptions({
  name: 'DataObject  Modal'
});

interface Props {
  dataObjectType: Api.Task.DataObjectType;
  selectedTableNames: Api.Task.selectedDataObject[];
  connectionId: number | undefined;
}

const props = defineProps<Props>();
const dataSource = ref<string[]>([]);

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const { formRef, validate, resetFields } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

// 1. 定义标题
const title = computed(() => {
  return $t('page.manage.user.addUser');
});

// 8. 关闭模态框
function closeModal() {
  visible.value = false;
}

const oriTargetKeys = selectedDataObject.filter(item => +item.key % 3 > 1).map(item => item.key);

const disabled = ref<boolean>(false);

const targetKeys = ref<string[]>(oriTargetKeys);

const handleChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
  console.log('targetKeys: ', nextTargetKeys);
  console.log('direction: ', direction);
  console.log('moveKeys: ', moveKeys);
};

// 获取数据
async function fetchData() {
  const response = await fetch('/api/getData');
  dataSource.value = await response.json();
}

// 监听弹出框的显示状态
watch(visible, async (newVal) => {
  if (newVal) {
    await fetchData(); // 弹出框打开时获取数据
  }
});
</script>

<template>
  <a-modal v-model:open="visible" :title="title" width="800px">
    <div class="h-518px overflow-y-auto">
      <a-form ref="formRef" :model="model" :rules="rules" :label-col="{ span: 5 }">
        <a-transfer v-model:target-keys="targetKeys" :data-source="dataSource" show-search :filter-option="filterOption" :render="item => item.title" @change="handleChange" @search="handleSearch" :listStyle="{ width: '100%', height: '500px' }" />
      </a-form>
    </div>
    <template #footer>
      <a-space :size="13">
        <a-button @click="closeModal">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>
<style scoped></style>
