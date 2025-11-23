<script setup lang="ts">
import { $t } from '@/locales';
import { translateOptions } from '@/utils/common';
import { useTableScroll } from '@/hooks/common/table';
import { computed, shallowRef, watch, ref } from 'vue';
import type { DataNode } from 'ant-design-vue/es/tree';
import type { TableColumnsType } from 'ant-design-vue';
import { MenuApi, PermissionApi } from '@/service/api/manage';
import { permissionTypeOptions, permissionTypeRecord } from '@/constants/options';

defineOptions({
  name: 'PermissionModal'
});

type Key = string | number;
interface Props { roleId?: number | null; }
const props = defineProps<Props>();

const menuId = ref<number[]>([1]);
const permissType = ref(undefined);
const title = computed(() => $t('common.edit') + $t('page.manage.role.menuAuth'));
const tree = shallowRef<DataNode[]>([]);
const menuChecks = shallowRef<number[]>([]);
////////////////////////////////////////////////////////////////////////
const selectedRowKeys = ref<number[]>([]);
const dataSource = ref<Api.SystemManage.Permission[]>([]);
const { tableWrapperRef, scrollConfig } = useTableScroll();
const visible = defineModel<boolean>('visible', { default: false });

//#region 列配置
const columns: TableColumnsType<Api.SystemManage.Permission> = [
   {
    key: 'menuTitle',
    dataIndex: 'menuTitle',
    title: $t('page.manage.permission.menuTitle'),
    align: 'center',
    customRender: ({ record }) => {
      const label = $t(record.menuTitle as App.I18n.I18nKey);
      return label;
    }
  },
  {
    key: 'permissCode',
    dataIndex: 'permissCode',
    title: $t('page.manage.permission.permissCode'),
    align: 'center',
    width: 150
  },
  {
    key: 'permissType',
    dataIndex: 'permissType',
    title: $t('page.manage.permission.permissType'),
    align: 'center',
    width: 120,
    customRender: ({ record }) => {
      if (!record.permissType) {
        return null;
      }
      const labelKey = permissionTypeRecord[record.permissType as Api.SystemManage.PermissionType];
      const label = labelKey ? $t(labelKey) : '';
      return label;
    }
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: $t('page.manage.permission.description'),
    align: 'center',
    minWidth: 200
  }
];
//#endregion

//#region 菜单树
async function getMenuTree() {
  const { error, data } = await MenuApi.fetchGetMenuTree();
  if (!error) {
    const homeItem = data.find(item => item.label === 'route.home');
    menuId.value = homeItem ? [homeItem.id] : [1];
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
//#endregion

//#region 角色菜单
async function getRoleMenu() {
  if (props.roleId) {
    const { error, data } = await PermissionApi.fetchGetRoleMenu(props.roleId);
    if (!error) {
      menuChecks.value = data;
    } else {
      menuChecks.value = [];
    }
  }
}
//#endregion

//#region 权限列表
async function getPermission() {
  if (menuId.value) {
    const { error, data: permissionData } = await PermissionApi.fetchGetPermission(menuId.value[0], permissType.value);
    if (!error) {
      dataSource.value = permissionData;
    } else {
      dataSource.value = [];
    }
  }
}
//#endregion

//#region 角色权限
async function getRolePermiss() {
  if (props.roleId && menuId.value) {
    const { error, data } = await PermissionApi.fetchGetRolePermiss(props.roleId, menuId.value[0]);
    if (!error) {
      selectedRowKeys.value = data.map(item => item.menuID);
    } else {
      selectedRowKeys.value = [];
    }
  }
}
//#endregion

//#region 事件菜单选中
async function handleMenuSelect(selectedKeys: any[]) {
  menuId.value = selectedKeys as number[];
  await getPermission();
  await getRolePermiss();
}
//#endregion

//#region 事件权限类型选中
async function handlePermissTypeChange() {
  await getPermission();
}
//#endregion

//#region 事件权限选中
const onSelectChange = (newSelectedRowKeys: Key[]) => {
  selectedRowKeys.value = newSelectedRowKeys as number[];
};
//#endregion

function closeModal() {
  visible.value = false;
}

async function handleSubmit() {
  if (props.roleId) {
    // 按照返回的 menuChecks 处理
    const roleMenuList = menuChecks.value.map(item => ({
      roleID: props.roleId,
      menuID: item,
    }));
    // 按照返回的 selectedRowKeys 处理
    const rolePermissList = dataSource.value.filter(permission => selectedRowKeys.value.includes(permission.menuID)).map(permission => ({
      roleID: props.roleId as number,
      menuID: permission.menuID,
      permissCode: permission.permissCode,
    }));
    const {error, response} = await PermissionApi.fetchSave({
      roleMenu: roleMenuList,
      rolePermiss: rolePermissList,
    });
    if (error) { window.$message?.error?.($t('common.modifyFailed')); return; }
    const result = response.data as { code: string; msg: string; data: boolean };
    if (result.msg==="success") {
      window.$message?.error?.($t('common.modifySuccess'));
      closeModal();
    } else if (result.msg==="fail") {
      window.$message?.error(result.data);
    } else {
      window.$message?.error($t('common.modifyFailed'));
    }
  }
}

async function init() {
  await getMenuTree();
  await getRoleMenu();
  await getPermission();
  await getRolePermiss();
}

watch(visible, val => {
  if (val) {
    init();
  }
});
</script>

<template>
  <a-modal v-model:open="visible" :title="title" width="1024px" >
    <a-row :gutter="[16, 16]" height="700px" class="h-700px">
      <a-col :span="6">
        <div class="menu-title"> {{$t('page.manage.role.menuAuth')}}</div>
        <div class="permission-tree-container">
          <a-tree v-model:checked-keys="menuChecks" :tree-data="tree" checkable  v-model:selectedKeys="menuId" @select="handleMenuSelect" />
        </div>
      </a-col>
      <!-- 右侧详情区域 -->
      <a-col :span="18">
        <div class="menu-title">
          {{$t('page.manage.permission.permissionSetting')}}
            <a-form-item name="permissions">
              <a-select v-model:value="permissType" :placeholder="$t('page.manage.permission.form.permissType')" :options="translateOptions(permissionTypeOptions)" @change="handlePermissTypeChange" allow-clear />
            </a-form-item>
        </div>
        <a-table ref="tableWrapperRef" :columns="columns" :data-source="dataSource" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"   :row-key="record => record.menuID" size="small" :scroll="scrollConfig" class="h-full" bordered :pagination="false" />
      </a-col>
    </a-row>
    <template #footer>
      <a-button size="small" @click="closeModal">
        {{ $t('common.cancel') }}
      </a-button>
      <a-button type="primary" size="small" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </a-button>
    </template>
  </a-modal>
</template>
<style scoped>
.permission-tree-container,
.permission-detail-container {
  height: 650px;
  display: flex;
  flex-direction: column;
  border: 1px solid #999999;
  overflow: auto;
}
.menu-title { line-height: 50px;}
</style>
