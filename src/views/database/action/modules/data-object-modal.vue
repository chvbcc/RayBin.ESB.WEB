<script setup lang="tsx">
import { $t } from '@/locales';
import { computed, ref, watch } from 'vue';
import { DatabaseSchemaApi } from '@/service/api/task';

// 定义组件名称
defineOptions({
  name: 'DataObjectModal'
});

// 组件属性定义
interface Props {
  selectedDataObjectNames: string[];
  connectionId: number | undefined;
  dataObjectType: Api.Task.DataObjectType;
}

const props = defineProps<Props>();
const dataSource = ref<{ key: string; title: string }[]>([]);
const targetKeys = ref<string[]>([...props.selectedDataObjectNames]);
const visible = defineModel<boolean>('visible', { default: false });
const title = computed(() => {return $t('page.database.dataObjectModalTitle');});

// 定义对话框返回的数据 emit
const emit = defineEmits<{
  (e: 'delete', deleteItems: string[], dataObjectType: Api.Task.DataObjectType): void;
  (e: 'add', dataObjectNodes: Api.Task.DataObjectNode[]): void;
}>();

// 获取数据
async function getDataObjectList() {
  if (!props.connectionId) { dataSource.value = []; return;}
  const { error, data  } = await DatabaseSchemaApi.fetchGetDataObjectList(props.connectionId, props.dataObjectType);
  if (!error) {
    dataSource.value = data.map((item: string) => ({key: item, title: item }));
  }
}

// 搜索过滤函数
const filterOption = (inputValue: string, option: any) => {
  return option.title.toLowerCase().includes(inputValue.toLowerCase());
};

// 确认
async function handleConfirm() {
  const deleteItems = props.selectedDataObjectNames.filter(name => !targetKeys.value.includes(name));
  if (deleteItems.length > 0) {
    emit('delete', deleteItems, props.dataObjectType);
  }
  const addItems = targetKeys.value.filter(name => !props.selectedDataObjectNames.includes(name));
  if (addItems.length > 0) {
    const { error, data } = await DatabaseSchemaApi.fetchGetDataObjects(props.connectionId!, props.dataObjectType, addItems);
    if (!error && data.result) {
      emit('add', data.result as Api.Task.DataObjectNode[]);
    }
  }
  closeModal();
}

// 关闭模态框
function closeModal() {
  visible.value = false;
}

// 监听弹出框的显示状态
watch(visible, async (newVal) => {
  if (newVal) {
    await getDataObjectList(); // 弹出框打开时获取数据
    targetKeys.value = [...props.selectedDataObjectNames];
  }
});
</script>

<template>
  <a-modal v-model:open="visible" :title="title" width="800px">
    <a-transfer v-model:target-keys="targetKeys" :data-source="dataSource" :rowKey="record => record.key!" :render="record => record.title" show-search :filter-option="filterOption" :list-style="{ width: '45%', height: '500px' }" />
    <template #footer>
      <a-space :size="13">
        <a-button @click="closeModal">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped>
::v-deep(:where(.css-dev-only-do-not-override-si047h).ant-btn.ant-btn-sm) {
  padding: 0px 7px 7px 7px !important;
}
</style>
