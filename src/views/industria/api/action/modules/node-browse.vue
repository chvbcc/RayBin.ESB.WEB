<script setup lang="tsx">
  import { $t, language } from '@/locales';
  import { computed, ref, watch } from 'vue';
  import { fetchBrowse, fetchReadNode } from '@/service/api/industria';
  import type { Key } from 'ant-design-vue/es/_util/type';

  // 定义组件名称
  defineOptions({ name: 'NodeBrowseModal' });

  // 组件属性定义
  const props = defineProps<{ visible: boolean;  connectionID?: number; }>();
  const emit = defineEmits<{ 'update:visible': [boolean]; 'confirm': [any]; }>();

  // #endregion
  interface Node extends Api.Industria.ApiDetailModel { key: string | number;}

  const labelCol = computed(() => language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } });

  // #region 2. 树形数据
  const treeData = ref<Node[]>([]);
  const loading = ref(false);
  const selectedNode = ref<Node>({ nodeID: '', attributeName: '', variableName: '', key: '0', builtInType: '',  nodeClass: '' } as Node);
  // #endregion

  // 确保 treeData 为数组（兼容后端返回对象或嵌套容器）
  function normalizeTreeData(data: any): Node[] {
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
    const raw = selectedNode.value;
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
    }
  });
  // #endregion

  // #region 7. 处理树形节点点击
  async function handleTreeSelect(selectedKeys: Key[], info: any) {
    const node = info?.node;
    if (node) {
      // 可选：验证关键字段是否存在
      if (node && (node.variableName && node.nodeID && node.nodeClass)) {
      if (selectedNode.value) {
          selectedNode.value.nodeID = node.nodeID;
          selectedNode.value.variableName = node.variableName;
          selectedNode.value.nodeClass = node.nodeClass;
          selectedNode.value.builtInType = node.builtInType || '';
          selectedNode.value.attributeName = node.attributeName || '';
        }
        const {error, data} = await fetchReadNode(props.connectionID!, node.nodeID);
        if (!error && data) {
          selectedNode.value.value = data.value;
          selectedNode.value.builtInType = data.builtInType;
          selectedNode.value.attributeName = data.attributeName;
        }
      } else {
        console.warn('Invalid node selected:', node);
      }
    }
  }
  // #endregion
</script>

<template>
  <a-modal :open="props.visible" @update:visible="emit('update:visible', $event)" :title="$t('page.industriaApiDetail.title')" style="width: 62%; min-height: 66vh; max-width: 1000px;">
    <a-form  :label-col="labelCol" class="flex flex-col">
      <a-row type="flex">
        <a-col flex="250px">
          <a-tree :field-names="{ title: 'variableName', key: 'nodeID', children: 'children' }" :tree-data="treeData" :loading="loading" @select="handleTreeSelect" style=" width:250px; height: 41vh; overflow: auto; border: 1px solid #ccc;">
            <template #title="{ variableName }">
              <span>{{ variableName }}</span>
            </template>
          </a-tree>
        </a-col>
        <a-col flex="auto">
            <a-col :span="24" class="mb-8">
              <a-form-item :label="$t('page.industriaApiDetail.nodeID')" name="nodeId" class="m-0">
                <a-input :value="selectedNode?.nodeID" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="mb-8">
              <a-form-item :label="$t('page.industriaApiDetail.nodeClass')" name="nodeClass" class="m-0">
                <a-input :value="selectedNode?.nodeClass" readonly style="background-color: #f5f5f5;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="mb-8">
              <a-form-item :label="$t('page.industriaApiDetail.nodeName')" name="variableName" class="m-0">
                <a-input :value="selectedNode?.variableName" readonly style="background-color: #f5f5f5;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="mb-8">
              <a-form-item :label="$t('page.industriaApiDetail.dataType')" name="builtInType" class="m-0">
                <a-input :value="selectedNode?.builtInType" readonly style="background-color: #f5f5f5;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="mb-8">
              <a-form-item :label="$t('page.industriaApiDetail.value')" name="value" class="m-0">
                <a-input :value="selectedNode?.value" readonly style="background-color: #f5f5f5;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="mb-8">
              <a-form-item :label="$t('page.industriaApiDetail.attributeName')" name="variableName" class="m-0">
                <a-input :value="selectedNode?.attributeName"  />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="mb-8">
              <a-form-item :label="$t('page.industriaApiDetail.description')" name="description" class="m-0">
                <a-textarea :rows="6" :value="selectedNode?.description" />
              </a-form-item>
            </a-col>
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
