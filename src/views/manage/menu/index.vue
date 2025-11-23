<script setup lang="tsx">
import { ref } from 'vue';
import { $t } from '@/locales';
import type { Ref } from 'vue';
import { useBoolean } from '@sa/hooks';
import { MenuApi } from '@/service/api/manage';
import MenuSearch from './modules/menu-search.vue';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { Button, Popconfirm, Tag } from 'ant-design-vue';
import { useTable, useTableOperate, useTableScroll } from '@/hooks/common/table';
import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';
import { enableStatusRecord, menuTypeRecord } from '@/constants/options';

const { bool: visible, setTrue: openModal } = useBoolean();
const { tableWrapperRef, scrollConfig } = useTableScroll();

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: MenuApi.fetchGetPagingList,
    apiParams: {
    current: 1,
    size: 10,
    name: undefined,
    path: undefined,
    title: undefined,
    status: undefined
  },
  columns: () => [
    {
      key: 'menuType',
      title: $t('page.manage.menu.menuType'),
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        const tagMap: Record<Api.SystemManage.MenuType, string> = {
          0: 'default',
          1: 'processing'
        };
        const label = $t(menuTypeRecord[record.menuType]);
        return <Tag color={tagMap[record.menuType]}>{label}</Tag>;
      }
    },
    {
      key: 'title',
      title: $t('page.manage.menu.title'),
      align: 'center',
      customRender: ({ record }) => {
        const { i18nKey, title } = record;
        const label = i18nKey ? $t(i18nKey) : title;
        return <span>{label}</span>;
      }
    },
    {
      key: 'icon',
      title: $t('page.manage.menu.icon').replace('Iconify', ''),
      align: 'center',
      width: 60,
      customRender: ({ record }) => {
        const icon = record.icon;
        const localIcon =  record.localIcon;
        return (
          <div class="flex-center">
            <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
          </div>
        );
      }
    },
    {
      key: 'name',
      title: $t('page.manage.menu.name'),
      align: 'center',
      dataIndex: 'name',
      minWidth: 120
    },
    {
      key: 'path',
      title: $t('page.manage.menu.path'),
      align: 'center',
      dataIndex: 'path',
      minWidth: 120
    },
    {
      key: 'status',
      title: $t('page.manage.menu.status'),
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        if (record.status === null) {
          return null;
        }
        const tagMap: Record<Api.Common.EnableStatus, string> = {
          0: 'success',
          1: 'warning'
        };
        const label = $t(enableStatusRecord[record.status]);
        return <Tag color={tagMap[record.status]}>{label}</Tag>;
      }
    },
    {
      key: 'hideInMenu',
      title: $t('page.manage.menu.hideInMenu'),
      dataIndex: 'hideInMenu',
      align: 'center',
      width: 120,
      customRender: ({ record }) => {
        const color = record.hideInMenu ? 'error' : 'default';
        const label = record.hideInMenu ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no');
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      customRender: ({ record }) => (
        <div class="flex-center justify-end gap-8px">
          {record.menuType === '0' && (
            <Button type="primary" ghost size="small" onClick={() => handleAddChildMenu(record)}>
              {$t('page.manage.menu.addChildMenu')}
            </Button>
          )}
          <Button type="primary" ghost size="small" onClick={() => handleEdit(record)}>
            {$t('common.edit')}
          </Button>
          <Popconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(record.id)}>
            <Button danger ghost size="small">
              {$t('common.delete')}
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ]
});

const { checkedRowKeys, rowSelection, onBatchDeleted, onDeleted } = useTableOperate(data, getData);
const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openModal();
}

async function handleBatchDelete() {
  if (checkedRowKeys.value.length === 0) return;
  const { error, response } = await MenuApi.fetchDeletes(checkedRowKeys.value);
  if (error) { window.$message?.error($t('common.deleteFailed')); return; }
  const result = response.data as { code: string; msg: string; data: boolean };
  if (result.msg === 'success') {
    onBatchDeleted();
  } else if (result.msg === 'fail') {
    window.$message?.error(result.data);
  } else {
    window.$message?.error($t('common.deleteFailed'));
  }
}

async function handleDelete(id: number) {
  const { error, response } = await MenuApi.fetchDelete(id);
  if (error) { window.$message?.error($t('common.deleteFailed')); return; }
  const result = response.data as { code: string; msg: string; data: boolean };
  if (result.msg === 'success') {
    onDeleted();
  } else if (result.msg === 'fail') {
    window.$message?.error(result.data);
  } else {
    window.$message?.error($t('common.deleteFailed'));
  }
}

/** the edit menu data or the parent menu data when adding a child menu */
const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);

function handleEdit(item: Api.SystemManage.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };
  console.log(editingData.value);
  openModal();
}

function handleAddChildMenu(item: Api.SystemManage.Menu) {
  operateType.value = 'addChild';
  editingData.value = { ...item };
  openModal();
}

const allPages = ref<string[]>([]);

async function getAllPages() {
  const { data: pages } = await MenuApi.fetchGetPages();
  allPages.value = pages || [];
}

function init() {
  getAllPages();
}

// init
init();
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <MenuSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <a-card :title="$t('page.manage.menu.pageTitle')" :bordered="false" :body-style="{ flex: 1, overflow: 'hidden' }" class="flex-col-stretch sm:flex-1-hidden card-wrapper">
      <template #extra>
        <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0" :loading="loading" @add="handleAdd" @delete="handleBatchDelete" @refresh="getData" />
      </template>
      <a-table ref="tableWrapperRef" :columns="columns" :data-source="data" :row-selection="rowSelection" size="small"
        :loading="loading" row-key="id" :scroll="scrollConfig" :pagination="mobilePagination" class="h-full" bordered />
      <MenuOperateModal v-model:visible="visible" :operate-type="operateType" :row-data="editingData" :all-pages="allPages" @submitted="getDataByPage" />
    </a-card>
  </div>
</template>

<style scoped></style>
