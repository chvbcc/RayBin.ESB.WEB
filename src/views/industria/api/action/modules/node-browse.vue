<script setup lang="tsx">
  import { $t, language } from '@/locales';
  import { computed, ref, watch } from 'vue';
  import { useAntdForm } from '@/hooks/common/form';
  import type { Key } from 'ant-design-vue/es/_util/type';
  import { JsonDataTypeOptions } from '@/constants/options';
  import { fetchBrowse, fetchReadNode } from '@/service/api/industria';

  // 定义组件名称
  defineOptions({ name: 'NodeBrowseModal' });

  // 组件属性定义
  const { formRef } = useAntdForm();
  const props = defineProps<{ visible: boolean; connectionID?: number; editData?: Partial<Api.Industria.ApiDetailModel> | null; }>();
  const emit = defineEmits<{ 'update:visible': [boolean]; 'confirm': [Api.Industria.ApiDetailModel]; }>();

  // #endregion
  interface Node extends Api.Industria.ApiDetailModel { key: string | number;}

  const labelCol = computed(() => language() === 'en-US' ? { style: { width: '141px' } } : { style: { width: '100px' } });

  // #region 2. 树形数据
  const treeData = ref<Node[]>([]);
  const loading = ref(false);
  const selectedNode = ref<Node>({
    id: 0,
    industriaApiID: 0,
    nodeName: '',
    nodeID: '',
    nodeClass: '',
    variableName: '',
    value: '',
    builtInType: '',
    attributeName: '',
    dataType: 0,
    description: '',
    key: '0'
  } as Node);
  // #endregion

  function createEmptyDetail(): Api.Industria.ApiDetailModel {
    return {
      id: 0,
      industriaApiID: 0,
      nodeName: '',
      nodeID: '',
      nodeClass: '',
      variableName: '',
      value: '',
      builtInType: '',
      attributeName: '',
      dataType: 0,
      description: ''
    };
  }

  function fillSelectedNode(detail?: Partial<Api.Industria.ApiDetailModel> | null) {
    const base = createEmptyDetail();
    const merged = { ...base, ...(detail || {}) };
    selectedNode.value = {
      ...merged,
      nodeName: merged.nodeName || '',
      nodeID: merged.nodeID || '',
      nodeClass: merged.nodeClass || '',
      variableName: merged.variableName || '',
      value: merged.value || '',
      builtInType: merged.builtInType || '',
      attributeName: merged.attributeName || '',
      dataType: merged.dataType || 0,
      key: merged.nodeID || String(merged.id || 0)
    } as Node;
  }

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
      console.error('get OPC UA node error:', err);
    } finally {
      loading.value = false;
    }
  }
  // #endregion

  // #region 4. 确认
  async function handleConfirm() {
    formRef.value?.validate().then(() => {
      if (!selectedNode.value) return;
      const detail = createEmptyDetail();
      detail.id = selectedNode.value.id || 0;
      detail.industriaApiID = selectedNode.value.industriaApiID || 0;
      detail.nodeName = selectedNode.value.nodeName || selectedNode.value.variableName || '';
      detail.nodeID = selectedNode.value.nodeID || '';
      detail.nodeClass = selectedNode.value.nodeClass || '';
      detail.variableName = selectedNode.value.variableName || selectedNode.value.nodeName || '';
      detail.value = selectedNode.value.value || '';
      detail.builtInType = selectedNode.value.builtInType || '';
      detail.attributeName = selectedNode.value.attributeName || '';
      detail.dataType = selectedNode.value.dataType || 0;
      detail.description = selectedNode.value.description || '';
      emit('confirm', detail);
      closeModal();
    })
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
      fillSelectedNode(props.editData);
      getOpcUaNodes();
    } else {
      // 重置状态
      treeData.value = [];
      fillSelectedNode();
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
          selectedNode.value.nodeName = node.nodeName;
          selectedNode.value.variableName = node.variableName;
          selectedNode.value.nodeClass = node.nodeClass;

          if (node.nodeID) formRef.value?.clearValidate(['nodeID']);
          if (node.nodeName) formRef.value?.clearValidate(['nodeName']);
          if (node.variableName) formRef.value?.clearValidate(['variableName']);
          if (node.nodeClass) formRef.value?.clearValidate(['nodeClass']);

        }
        const {error, data} = await fetchReadNode(props.connectionID!, node.nodeID);
        if (!error && data) {
          selectedNode.value.builtInType = data.builtInType;
          selectedNode.value.value = data.value;
          selectedNode.value.dataType = data.dataType;
          selectedNode.value.attributeName = data.attributeName;
          selectedNode.value.description = data.description;

          if (node.builtInType) formRef.value?.clearValidate(['builtInType']);
          if (data.dataType) formRef.value?.clearValidate(['dataType']);
          if (data.attributeName) formRef.value?.clearValidate(['attributeName']);
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
    <a-form ref="formRef" :model="selectedNode" :label-col="labelCol" class="flex flex-col">
      <a-row type="flex">
        <a-col flex="250px">
          <a-tree :field-names="{ title: 'variableName', key: 'nodeID', children: 'children' }" :tree-data="treeData" :loading="loading" @select="handleTreeSelect" style=" width:250px; height: 43vh; overflow: auto; border: 1px solid #ccc;">
            <template #title="{ variableName }">
              <span>{{ variableName }}</span>
            </template>
          </a-tree>
        </a-col>
        <a-col flex="auto">
            <a-col :span="24" class="h-15">
              <a-form-item :label="$t('page.industriaApiDetail.nodeName')" name="nodeName" :rules="[{ required: true }]" class="m-0">
                <a-input v-model:value="selectedNode.nodeName" :placeholder="$t('page.industriaApiDetail.form.nodeName')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="h-15">
              <a-form-item :label="$t('page.industriaApiDetail.nodeID')" name="nodeID" :rules="[{ required: true }]" class="m-0">
                <a-input v-model:value="selectedNode.nodeID" :placeholder="$t('page.industriaApiDetail.form.nodeID')" readonly style="background-color: #f5f5f5;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="h-15">
              <a-form-item :label="$t('page.industriaApiDetail.nodeClass')" name="nodeClass" :rules="[{ required: true }]"class="m-0">
                <a-input v-model:value="selectedNode.nodeClass" :placeholder="$t('page.industriaApiDetail.form.nodeClass')" readonly style="background-color: #f5f5f5;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="h-15">
              <a-form-item :label="$t('page.industriaApiDetail.variableName')" name="variableName" :rules="[{ required: true }]" class="m-0">
                <a-input v-model:value="selectedNode.variableName" :placeholder="$t('page.industriaApiDetail.form.variableName')" readonly style="background-color: #f5f5f5;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="h-15">
              <a-form-item :label="$t('page.industriaApiDetail.builtInType')" name="builtInType" :rules="[{ required: true }]" class="m-0">
                <a-input v-model:value="selectedNode.builtInType" :placeholder="$t('page.industriaApiDetail.form.builtInType')" readonly style="background-color: #f5f5f5;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="h-15">
              <a-form-item :label="$t('page.industriaApiDetail.value')" name="value" class="m-0">
                <a-input v-model:value="selectedNode.value" readonly style="background-color: #f5f5f5;" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="h-15">
              <a-form-item :label="$t('page.industriaApiDetail.attributeName')" name="attributeName" :rules="[{ required: true }]" class="m-0">
                <a-input v-model:value="selectedNode.attributeName" :placeholder="$t('page.industriaApiDetail.form.attributeName')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" class="h-15">
              <a-form-item :label="$t('page.industriaApiDetail.dataType')" name="dataType" :rules="[{ required: true }]" class="m-0">
                <a-select v-model:value="selectedNode.dataType" :placeholder="$t('page.industriaApiDetail.form.dataType')" :options="JsonDataTypeOptions" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="$t('page.industriaApiDetail.description')" name="description" class="m-0">
                <a-textarea v-model:value="selectedNode.description" :placeholder="$t('page.industriaApiDetail.form.description')" :rows="2" />
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
