<script setup lang="tsx">
  import { Tag } from 'ant-design-vue';
  import { $t, language } from '@/locales';
  import { computed, ref, watch } from 'vue';
  import { fetchBrowse } from '@/service/api/industria';

  // 定义组件名称
  defineOptions({
    name: 'NodeBrowseModal'
  });

  // 组件属性定义
  const props = defineProps<{
    visible: boolean;
    connectionID?: number;
  }>();
  const emit = defineEmits<{
    'update:visible': [boolean];
    'confirm': [any];
  }>();
  // #endregion

  const model = ref<Api.Message.MessageModel>({} as Api.Message.MessageModel);
  const labelCol = computed(() => language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } });

  // #region 2. 树形数据
  const treeData = ref<any[]>([]);
  const selectedNode = ref<any>(null);
  const loading = ref(false);
  // #endregion

  // 确保 treeData 为数组（兼容后端返回对象或嵌套容器）
  function normalizeTreeData(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    // 检查是否有 value 字段（根据你的返回数据）
    if (data.value && Array.isArray(data.value)) return data.value;

    const candidates = ['Children', 'children'];
    for (const k of candidates) {
      if (data[k] && Array.isArray(data[k])) return data[k];
    }

    if (typeof data === 'object') return [data];
    return [];
  }

  // #region 3. 获取 OPC UA 节点数据
  async function getOpcUaNodes() {
    if (!props.connectionID) return;
    loading.value = true;
    try {
      const { error, data } = await fetchBrowse(props.connectionID);
      if (!error && data) {
        const normalizedData = normalizeTreeData(data);
        treeData.value = normalizedData;
      }
    } catch (err) {
      console.error('获取 OPC UA 节点时发生错误:', err);
    } finally {
      loading.value = false;
    }
  }
  // #endregion

  // #region 4. 确认
  async function handleConfirm() {
    if (!selectedNode.value) return;
    // 优先返回后端原始对象（dataRef），否则返回当前节点对象
    const raw = selectedNode.value?.dataRef ?? selectedNode.value;
    emit('confirm', raw);
    closeModal();
  }
  // #endregion

  // #region 5. 关闭模态框
  function closeModal() {
    emit('update:visible', false);
  }
  // #endregion

  // #region 6. 监听弹出框的显示状态
  watch(() => props.visible, async (newVal) => {
    if (newVal) {
      getOpcUaNodes();
    } else {
      // 重置状态
      treeData.value = [];
      selectedNode.value = null;
    }
  });
  // #endregion

  // #region 7. 处理树形节点点击
function handleTreeSelect(selectedKeys: string[], info: any) {
  const node = info?.node;
  if (node && node.isLeaf) {
    // 确保 node 或 node.dataRef 存在且有基本字段
    const raw = node.dataRef ?? node;
    // 可选：验证关键字段是否存在
    if (raw && (raw.DisplayName || raw.title || raw.NodeId)) {
      selectedNode.value = raw;
      console.log('Selected node:', selectedNode.value);
    } else {
      selectedNode.value = null;
      console.warn('Invalid node selected:', node);
    }
  } else {
    selectedNode.value = null;
  }
}
  // #endregion
</script>

<template>
  <a-modal :open="props.visible" @update:visible="emit('update:visible', $event)" :title="$t('page.industriaApiDetail.title')" style="width: 68%; min-height: 90vh; max-width: 1200px;">
    <a-form :model="model" :label-col="labelCol" class="flex flex-col">
      <a-row type="flex">
        <a-col flex="300px">
          <a-tree :field-names="{ title: 'displayName', key: 'nodeId', children: 'children' }" :tree-data="treeData" :loading="loading" @select="handleTreeSelect as any" style="height: 50vh; overflow-y: auto; border: 1px solid #ccc;">
            <template #title="{ displayName }">
              <sapn>{{ displayName }}</sapn>
            </template>
          </a-tree>
        </a-col>
        <a-col flex="auto">
          <a-row :gutter="[16, 16]" wrap>
            <a-col :span="24">
              <a-form-item :label="$t('page.industriaApiDetail.nodeName')" name="displayName" class="m-0">
                <a-input v-model:value="selectedNode.displayName" :placeholder="$t('page.industriaApiDetail.form.nodeName')" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <a-space :size="13" class="mr16">
        <a-button @click="closeModal">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleConfirm" :disabled="!selectedNode">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped>
 .mr16 { margin-right: 16px !important; }
</style>
