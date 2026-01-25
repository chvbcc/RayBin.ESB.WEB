<script setup lang="tsx">
  import { $t, language } from '@/locales';
  import { Button, Tag } from 'ant-design-vue';
  import { UserApi }  from '@/service/api/manage';
  import { onMounted, computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAppStore } from '@/store/modules/app';
  import { enableStatusRecord, userGenderRecord } from '@/constants/options';
  import { useTable, useTableOperate, useTableScroll } from '@/hooks/common/table';
  const { scrollConfig } = useTableScroll();

  const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useTable({
    apiFn: UserApi.fetchGetPagingList,
    apiParams: {
      current: 1,
      size: 10
    },
    columns: () => [
      {
        key: 'index',
        title: $t('common.index'),
        dataIndex: 'index',
        align: 'center',
        width: 64
      },
      {
        key: 'username',
        dataIndex: 'username',
        title: $t('page.manage.user.username'),
        align: 'center',
        minWidth: 100
      },
      {
        key: 'gender',
        title: $t('page.manage.user.gender'),
        align: 'center',
        dataIndex: 'gender',
        width: 100,
        customRender: ({ record }) => {
          if (record.gender === null) {
            return null;
          }
          const label = $t(userGenderRecord[record.gender]);
          return label;
        }
      },
      {
        key: 'employeeName',
        dataIndex: 'employeeName',
        title: $t('page.manage.user.employeeName'),
        align: 'center',
        width: 120
      },
      {
        key: 'email',
        dataIndex: 'email',
        title: $t('page.manage.user.email'),
        align: 'center',
        minWidth: 200
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: $t('page.manage.user.status'),
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
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 130,
        customRender: ({ record }) => (
          <div class="flex-center justify-end gap-8px">
            <a-popconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(record.id)}>
              <Button danger size="small">
                {$t('common.delete')}
              </Button>
            </a-popconfirm>
          </div>
        )
      }
    ]
  });

  const {
    checkedRowKeys,
    rowSelection,
    onBatchDeleted,
    onDeleted
  } = useTableOperate(data, getData);

  async function handleBatchDelete() {

  }

  async function handleDelete(id: number) {

  }

  // #region 1. 参数定义
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();

  // 根据语言动态设置 labelCol 宽度
  const labelCol =  computed(() =>language() === 'en-US' ?  { style: { width: '141px' } } :  { style: { width: '100px' } });

  const taskModel = computed(() => {
    const modelData = JSON.parse(decodeURIComponent(route.query.model as string));
    return modelData;
  });
  //#endregion

  // #region 3. 初始化时
  onMounted(async  () => {
    console.log('onMounted');
    // 从路由参数中获取ID （加载编辑数据）
    // if (id) {
    //   const { error, data } = await TaskDatabaseApi.fetchGetModel(id);
    //   if (!error && data) {
    //     model.value = {
    //       task: { ...createDefaultModel().task, ...data.task },
    //       taskDatabase: { ...createDefaultModel().taskDatabase, ...data.taskDatabase }
    //     };
    //   }
    // }
  });
  // #endregion

  // #region 7. 返回列表
  function handleBack() {
    appStore.tabStore.removeActiveTab();
    router.push({ name: 'message' });
  }
  // #endregion
</script>

<template>
  <div class="min-h-500px flex flex-col h-full lt-sm:overflow-auto pr-3">
    <a-form ref="formRefTask" :model="taskModel" :label-col="labelCol" class="flex flex-col">
      <a-card :title="$t('page.message.taskinfo')" :bordered="false" class="mb-4">
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.message.taskID')" name="taskId" class="m-0">
                <a-input :value="taskModel.taskId" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.message.taskType')" name="taskType" class="m-0">
                <a-input :value="taskModel.taskType" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.message.taskName')" name="taskName" class="m-0">
                <a-input :value="taskModel.taskName" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.message.runMode')" name="runMode" class="m-0">
                <a-input :value="taskModel.runMode" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.message.taskStatus')" name="status" class="m-0">
                <a-input :value="taskModel.status" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.message.description')" name="description" class="m-0">
                <a-input :value="taskModel.description" disabled />
              </a-form-item>
            </a-col>
          </a-row>
      </a-card>
      <a-card :title="$t('page.message.assignedUsers')" :bordered="false" class="flex flex-col flex-1">
      <template #extra>
        <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0" :loading="loading" @delete="handleBatchDelete" @refresh="getData" />
      </template>
      <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" size="small" :loading="loading" row-key="id" :scroll="scrollConfig" :pagination="mobilePagination" class="h-full" bordered />
      </a-card>
    </a-form>

    <!-- <DataObjectModal v-model:visible="dataObjectModalVisible" :connection-id="dialogModel.connectionID" :data-object-type="dialogModel.dataObjectType" :selected-data-object-names="selectedDataObjectNames" @delete="handleDelete" @add="handleAdd" />
    <DataHandleModal v-model:visible="dataHandleModalVisible" :programme-language="model.taskDatabase.dataHandleLanguage" @confirm="handleConfirm" /> -->
  </div>
</template>

<style scoped>
  .ant-input-disabled {color:#888 !important; }
</style>
