<script setup lang="tsx">
  import { Tag } from 'ant-design-vue';
  import { $t, language } from '@/locales';
  import { convertOptions } from '@/utils/common';
  import { useTableScroll } from '@/hooks/common/table';
  import { computed, ref, watch, reactive, nextTick } from 'vue';
  import type { TableColumnsType, FormInstance } from 'ant-design-vue';
  import { fetchGetUserPagingList, fetchSave } from '@/service/api/message';
  import { enableStatusRecord, userGenderRecord, messageTypeOptions, messageInsertFieldsOptions, userSearchFieldsOptions } from '@/constants/options';

  // 定义组件名称
  defineOptions({
    name: 'MessageModal'
  });

  // 组件属性定义
  interface Props {
    taskID: number;
    userIds: number[];
  }

  // #region 3. 组件事件
  const emit = defineEmits([
    'confirm',
  ])

  // #endregion
  const messageContentRef = ref();
  const userSearchKeyWord = ref<string>('');
  const props = defineProps<Props>();
  const formRefTask = ref<FormInstance>();
  const { scrollConfig } = useTableScroll();
  const title = computed(() => {return $t('page.message.assignUser');});
  const messageFields = ref<Api.Message.MessageInsertFields | 0>();
  const userSearchFields = ref<Api.Message.UserSearchFields | 0>();
  const visible = defineModel<boolean>('visible', { default: false });
  const model = ref<Api.Message.MessageModel>({} as Api.Message.MessageModel);
  const labelCol =  computed(() =>language() === 'en-US' ?  { style: { width: '141px' } } :  { style: { width: '100px' } });

  // #region 2.分页参数
  const data = ref<Api.SystemManage.User[]>([]);
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
      width: 80,
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
      key: 'weCom',
      dataIndex: 'weCom',
      title: $t('page.manage.user.weCom'),
      align: 'center',
      width: 130
    },
    {
      key: 'dingTalk',
      dataIndex: 'dingTalk',
      title: $t('page.manage.user.dingTalk'),
      align: 'center',
      width: 130,
      ellipsis: true
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: $t('page.manage.user.status'),
      align: 'center',
      width: 90,
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
    }
  ]);
  // #endregion

  // #region 5. 获取数据
  async function getData() {
    loading.value = true;
    try {
      let fieldName = "";
      if (userSearchFields.value !== undefined && userSearchFields.value !== null && userSearchKeyWord.value.trim() !== "") {
        switch (userSearchFields.value) {
          case 0: fieldName = "Username"; break;
          case 1: fieldName = "EmployeeName"; break;
          case 2: fieldName = "EmployeeNo"; break;
          case 3: fieldName = "Phone"; break;
          case 4: fieldName = "Email"; break;
        }
      }
      const params = { current: pagination.current, size: pagination.pageSize, userIds: props.userIds,
        searchFieldName: fieldName,
        searchKeyWord: userSearchKeyWord.value
      };
      const { error, data: response } = await fetchGetUserPagingList(params);
      if (!error && response) {
        data.value = response.records.map((item: Api.SystemManage.User, index: number) => {
          return {
            ...item,
            index: (pagination.current - 1) * pagination.pageSize + index + 1
          };
        });
        pagination.total = response.total;
        selectedRowKeys.value = [];
        await nextTick();
      }
    } catch (err) {
      console.error('获取数据时发生错误:', err);
    } finally {
      loading.value = false;
    }
  }
  // #endregion

  // #region 6. 插入字段
  async function handleInsert() {
    if (messageFields.value === undefined || messageFields.value === null) return;
    // 获取文本框的当前值和光标位置
    const textarea: HTMLTextAreaElement | null =
      messageContentRef.value?.resizableTextArea?.textArea ||
      messageContentRef.value?.$el?.querySelector('textarea') || null;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const content = model.value.messageContent || '';

    // 在光标位置插入字段的值
    const fieldText = `{${messageFields.value}}`;
    const newContent = content.substring(0, start) + fieldText + content.substring(end);

    // 更新模型值
    model.value.messageContent = newContent;

    // 重新设置光标位置到插入内容之后
    nextTick(() => {
      const newCursorPosition = start + fieldText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    });
  }
  // #endregion

  // #region 7. 确认
  async function handleConfirm() {
    formRefTask.value?.validate().then(async () => {
      model.value.taskID = props.taskID;
      model.value.userIds= props.userIds || [];
      if (selectedRowKeys.value.length === 0) return;
      model.value.userIds.push(...selectedRowKeys.value);
      const { error } = await fetchSave(model.value);
      if (error) return;
      emit('confirm');
      closeModal();
    });
  }
  // #endregion

  // #region 8. 关闭模态框
  function closeModal() {
    visible.value = false;
  }
  // #endregion

  // #region 9. 监听弹出框的显示状态
  watch(visible, async (newVal) => {
    if (newVal) {
      getData();
    } else {
      model.value.userIds = [];
      messageFields.value = undefined;
      userSearchFields.value = undefined;
      formRefTask.value?.resetFields();
    }
  });
  // #endregion
</script>

<template>
  <a-modal v-model:open="visible" :title="title" style="width: 90%; height: 70vh; max-width: 1200px;">
    <a-form ref="formRefTask" :model="model" :label-col="labelCol" class="flex flex-col">
      <a-row :gutter="[16, 16]" class="mr16">
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.message.messageType')" name="messageType" class="m-0" :rules="[{ required: true}]">
            <a-select v-model:value="model.messageType" :placeholder="$t('page.message.form.messageType')" :options="convertOptions(messageTypeOptions)" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.message.messageField')" name="messageFields" class="m-0">
            <div style="display: flex; align-items: center; gap: 10px;">
              <a-select v-model:value="messageFields" :placeholder="$t('page.message.form.messageField')" :options="convertOptions(messageInsertFieldsOptions)" allow-clear />
              <a-button type="primary" class="orange-btn ml-3" @click="handleInsert">{{$t('page.message.messageInsert')}}</a-button>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="24" :lg="24">
          <a-form-item :label="$t('page.message.emailSubject')" name="emailSubject" class="m-0" :rules="[{ required: model.messageType === 3}]">
            <a-input v-model:value="model.emailSubject" :rows="4" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="24" :lg="24">
          <a-form-item :label="$t('page.message.messageContent')" name="messageContent" class="m-0" :rules="[{ required: true}]">
            <a-textarea ref="messageContentRef" v-model:value="model.messageContent" :rows="4" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="[16, 16]" class="mt-6">
        <a-col :span="24" :md="16" :lg="16">
          <a-form-item :label="$t('page.message.userSearchField')" class="m-0">
            <div style="display: flex; align-items: center; gap: 10px;">
              <a-select v-model:value="userSearchFields" :placeholder="$t('page.message.form.userSearchField')" :options="convertOptions(userSearchFieldsOptions)" allow-clear />
              <a-input v-model:value="userSearchKeyWord" :placeholder="$t('page.message.form.userSearchKeyword')" />
              <a-button type="primary" class="blue-btn ml-3" @click="getData">{{$t('page.message.userSearch')}}</a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="mltr16">
        <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" size="small" :loading="loading" row-key="id" :scroll="scrollConfig" :pagination="pagination" class="h-full" style="min-height: 300px;" bordered />
      </div>
    </a-form>
    <template #footer>
      <a-space :size="13" class="mr16">
        <a-button @click="closeModal">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped>
 .mr16 { margin-right: 16px !important; }
 .mltr16 { margin-left: 16px !important; margin-top: 16px !important; margin-right: 16px !important; }
</style>
