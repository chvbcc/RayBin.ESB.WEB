<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import type { SelectProps } from 'ant-design-vue';
import type { DataNode } from 'ant-design-vue/es/tree';
import { $t } from '@/locales';
import { MenuApi } from '@/service/api/manage';

defineOptions({
  name: 'MenuAuthModal'
});

interface Props {
  /** the roleId */
  roleId: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeModal() {
  visible.value = false;
}

const title = computed(() => $t('common.edit') + $t('page.manage.role.menuAuth'));

const tree = shallowRef<DataNode[]>([]);

async function getTree() {
  const { error, data } = await MenuApi.fetchGetMenuTree();
  if (!error) {
    const treeData = transformTreeData(data);
    tree.value = recursiveTransform(treeData);
  }
}

function transformTreeData(data: any[]): Api.SystemManage.MenuTree[] {
  return data.map(item => ({
    ...item,
    label: $t(item.label),
    children: item.children && item.children.length > 0 ? transformTreeData(item.children) : undefined
  }));
}

function recursiveTransform(data: Api.SystemManage.MenuTree[]): DataNode[] {
  return data.map(item => {
    const { id: key, label } = item;

    if (item.children) {
      return {
        key,
        title: label,
        children: recursiveTransform(item.children)
      };
    }

    return {
      key,
      title: label
    };
  });
}

const checks = shallowRef<number[]>([]);

async function getChecks() {
  checks.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21];
}

function handleSubmit() {
  console.log(checks.value, props.roleId);
  window.$message?.success?.($t('common.modifySuccess'));
  closeModal();
}

async function init() {
  await getTree();
  await getChecks();
}

watch(visible, val => {
  if (val) {
    init();
  }
});
</script>

<template>
  <a-modal v-model:open="visible" :title="title" class="w-800px h-600px">
    <a-tree v-model:checked-keys="checks" :tree-data="tree" checkable :height="280" class="h-280px" />
    <template #footer>
      <a-button size="small" class="mt-16px" @click="closeModal">
        {{ $t('common.cancel') }}
      </a-button>
      <a-button type="primary" size="small" class="mt-16px" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </a-button>
    </template>
  </a-modal>
</template>
<style scoped></style>
