<script setup lang="tsx">
  import { Tag } from 'ant-design-vue';
  import { $t, language } from '@/locales';
  import EditModel  from './modules/edit-modal.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAppStore } from '@/store/modules/app';
  import { useTableScroll } from '@/hooks/common/table';
  import type { TableColumnsType } from 'ant-design-vue';
  import { onMounted, computed, ref, reactive } from 'vue';
  import MessageModel  from './modules/message-modal.vue';
  import { getAssignedUserPagingList, fetchDeletes } from '@/service/api/message';
  import { enableStatusRecord, userGenderRecord, messageTypeRecord } from '@/constants/options';

  // #region 1. 参数定义
  const id = ref(0);
  const messageType = ref<Api.Message.MessageType>(0);
  const emailSubject = ref<string>('');
  const messageContent = ref<string>('');
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();
  const editModelVisible = ref(false);
  const messageModalVisible = ref(false);
  const { scrollConfig } = useTableScroll();
  const disableDelete = computed(() => !selectedRowKeys.value.length || loading.value);
  const labelCol =  computed(() =>language() === 'en-US' ?  { style: { width: '141px' } } :  { style: { width: '100px' } });
  const taskModel = computed(() => {
    const modelData = JSON.parse(decodeURIComponent(route.query.model as string));
    return modelData;
  });
  //#endregion

  // #region 2.分页参数
  type MessageData = Api.Message.Message;
  const data = ref<MessageData[]>([]);
  const loading = ref(false);
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '15', '20', '25', '30'],
    onChange: (page: number, size: number) => {
      pagination.current = page;
      pagination.pageSize = size;
      getData();
    }
  });
  // #endregion

  // #region 3. 表格选择功能
  const userIds = ref<number[]>([]);
  const selectedRowKeys = ref<number[]>([]);
  const rowSelection = computed(() => ({
    selectedRowKeys: selectedRowKeys.value,
    onChange: (selectedKeys: any[]) => {
      selectedRowKeys.value = selectedKeys as number[];
    },
    type: 'checkbox' as const,
    columnWidth: 50,
  }));
  // #endregion

  // #region 4. 表格列
  const columns = computed<TableColumnsType<Api.Message.Message>>(() => [
    {
      key: 'employeeName',
      dataIndex: 'employeeName',
      title: $t('page.manage.user.employeeName'),
      align: 'center',
      ellipsis: true,
      width: 120
    },
    {
      key: 'gender',
      title: $t('page.manage.user.gender'),
      align: 'center',
      dataIndex: 'gender',
      width: 100,
      customRender: ({ record }) => {
        if (record.gender === null) return null;
        const label = $t(userGenderRecord[record.gender]);
        return label;
      }
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: $t('page.manage.user.email'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'messageType',
      title: $t('page.message.messageType'),
      dataIndex: 'messageType',
      align: 'center',
      width: 90,
      customRender: ({ record }: { record: Api.Message.Message }) => {
        if (record.messageType === null) return null;
        const label = $t(messageTypeRecord[record.messageType]);
        return label;
      }
    },
    {
      key: 'messageContent',
      dataIndex: 'messageContent',
      title: $t('page.message.messageContent'),
      align: 'center',
      minWidth: 100,
      ellipsis: true
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
      width: 160,
      customRender: ({ record }) => (
        <div class="flex-center gap-8px">
          <a-button type="default" class="orange-btn row-btn" onClick={() => {
              id.value = record.id;
              messageType.value = record.messageType as Api.Message.MessageType;
              emailSubject.value = record.emailSubject;
              messageContent.value = record.messageContent;
              editModelVisible.value = true;
            }}>
            <icon-mdi-square-edit-outline class="align-sub text-16px" />
            <span>{$t('common.edit')}</span>
          </a-button>
          <a-popconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(record.id)}>
            <a-button type="default" class="red-btn row-btn">
              <icon-mdi-trash-can-outline class="align-sub text-16px" />
              <span>{$t('common.delete')}</span>
            </a-button>
          </a-popconfirm>
        </div>
      )
    }
  ]);
  // #endregion

  // #region 5. 获取数据
  async function getData() {
    loading.value = true;
    try {
      const params = { current: pagination.current, size: pagination.pageSize, taskId: taskModel.value.taskID };
      const { error, data: response } = await getAssignedUserPagingList(params);
      if (!error && response) {
        userIds.value = [];
        data.value = response.records.map((item: Api.Message.Message, index: number) => {
          userIds.value.push(item.userID);
          return {
            ...item,
            index: (pagination.current - 1) * pagination.pageSize + index + 1
          };
        });
        pagination.total = response.total;
      }
    } catch (err) {
      window.$message?.error($t('common.getDataFailed'));
    } finally {
      loading.value = false;
    }
  }
  // #endregion

  // #region 6. 删除操作
  async function handleBatchDelete() {
    const { error, response } = await fetchDeletes(selectedRowKeys.value);
    if (error) { window.$message?.error($t('common.deleteFailed')); return; }
    const result = response.data as { code: string; msg: string; data: string };
    if (result.msg === "success") {
      await getData();
    } else if (result.msg === "fail") {
      window.$message?.error(result.data);
    } else {
      window.$message?.error($t('common.deleteFailed'));
    }
  }

  async function handleDelete(id: number) {
    const { error, response } = await fetchDeletes([id]);
    if (error) { window.$message?.error($t('common.deleteFailed')); return; }
    const result = response.data as { code: string; msg: string; data: string };
    if (result.msg === "success") {
      await getData();
    } else if (result.msg === "fail") {
      window.$message?.error(result.data);
    } else {
      window.$message?.error($t('common.deleteFailed'));
    }
  }
  // #endregion

  // #region 7. 返回列表
  function handleBack() {
    appStore.tabStore.removeActiveTab();
    router.push({ name: 'message' });
  }
  // #endregion

  // #region 8. 初始化时
  onMounted(async () => {
    await getData();
  });
  // #endregion
</script>

<template>
  <div class="min-h-500px flex flex-col h-full lt-sm:overflow-auto pr-3">
    <a-form ref="formRefTask" :model="taskModel" :label-col="labelCol" class="flex flex-col">
      <a-card :title="$t('page.message.taskinfo')" :bordered="false" class="mb-4">
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.id')" name="taskId" class="m-0">
                <a-input :value="taskModel.taskID" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.taskType')" name="taskType" class="m-0">
                <a-input :value="taskModel.taskType" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.taskName')" name="taskName" class="m-0">
                <a-input :value="taskModel.taskName" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.runMode')" name="runMode" class="m-0">
                <a-input :value="taskModel.runMode" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.status')" name="status" class="m-0">
                <a-input :value="taskModel.status" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :lg="12">
              <a-form-item :label="$t('page.task.description')" name="description" class="m-0">
                <a-input :value="taskModel.description" disabled />
              </a-form-item>
            </a-col>
          </a-row>
      </a-card>
      <a-card :title="$t('page.message.assignedUsers')" :bordered="false" class="flex flex-col flex-1">
        <template #extra>
          <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
            <slot name="default">
              <a-button type="primary" ghost @click="messageModalVisible = true">
                <template #icon>
                  <icon-mdi-plus class="align-sub text-icon" :class="{ 'animate-spin': loading }" />
                </template>
                <span class="ml-0px">{{ $t('common.add') }}</span>
              </a-button>
              <a-popconfirm :title="$t('common.confirmDelete')" :disabled="disableDelete" @confirm="handleBatchDelete">
                <a-button type="primary" ghost :disabled="disableDelete">
                  <template #icon>
                    <icon-mdi-trash-can-outline class="align-sub text-icon" />
                  </template>
                  <span class="ml-5px">{{ $t('common.delete') }}</span>
                </a-button>
              </a-popconfirm>
              <a-button type="primary" ghost @click="handleBack">
                <icon-stash:arrow-reply-solid class="align-sub text-icon" />
                <span style="padding-left:5px;">{{$t('common.back')}}</span>
              </a-button>
            </slot>
          </div>
        </template>
      <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" size="small" :loading="loading" row-key="id" :scroll="scrollConfig" :pagination="pagination" class="h-full"  bordered />
      </a-card>
      <EditModel v-model:visible="editModelVisible" :id="id" :messageType="messageType" :emailSubject="emailSubject" :messageContent="messageContent" @confirm="getData" />
      <MessageModel v-model:visible="messageModalVisible" :taskID="taskModel.taskID" :userIds="userIds" @confirm="getData" />
    </a-form>
  </div>
</template>

<style scoped>
  .ant-input-disabled {color:#888 !important; }
</style>
