<script setup lang="tsx">
  import { Tag } from 'ant-design-vue';
  import { $t, language } from '@/locales';
  import { convertOptions } from '@/utils/common';
  import { computed, ref, watch, reactive, nextTick } from 'vue';
  import { fetchGetUserPagingList } from '@/service/api/message';
  import type { TableColumnsType, FormInstance } from 'ant-design-vue';
  import { enableStatusRecord, userGenderRecord, userSearchFieldsOptions } from '@/constants/options';

  // 定义组件名称
  defineOptions({
    name: 'MessageRecipientModal'
  });

  // 组件属性定义
  interface Props {
    selectedUsers: SelectedUser[];
  }

  interface SelectedUser {
    userId: number;
    userName: string;
  }
  // #region 3. 组件事件
  const emit = defineEmits<{
    confirm: [ { selectedUsers: SelectedUser[] } ]
  }>()
  // #endregion

  // #endregion
  const userSearchKeyWord = ref<string>('');
  const props = defineProps<Props>();
  const formRefTask = ref<FormInstance>();
  const title = computed(() => {return $t('page.message.assignUser');});
  const messageFields = ref<Api.Message.MessageInsertFields | 0>();
  const userSearchFields = ref<Api.Message.UserSearchFields | 0>();
  const modelVisible  = defineModel<boolean>({ default: false });
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
      width: 180,
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
       // 提取 userId 为数组
      const userIds = props.selectedUsers.map(user => user.userId);
      const params = { current: pagination.current, size: pagination.pageSize, userIds: userIds,
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

  // #region 7. 确认
  async function handleConfirm() {
    formRefTask.value?.validate().then(async () => {
      if (selectedRowKeys.value.length === 0) return;

      // 获取选中的用户数据
      const selectedUsers = data.value.filter(user =>
        selectedRowKeys.value.includes(user.id)
      );

      // 构造用户对象数组
      const users = selectedUsers.map(user => ({
        userId: user.id, // 将数字ID转换为字符串
        userName: user.employeeName
      }));

      // 合并原有的选中用户和新选中的用户
      const allSelectedUsers = [...props.selectedUsers, ...users];

      // 准备保存数据
      emit('confirm', { selectedUsers: allSelectedUsers } );
      closeModal();
    });
  }
  // #endregion

  // #region 8. 关闭模态框
  function closeModal() {
    modelVisible.value = false;
  }
  // #endregion

  // #region 9. 监听弹出框的显示状态
  watch(modelVisible, async (newVal) => {
    if (newVal) {
      getData();
    } else {
      messageFields.value = undefined;
      userSearchFields.value = undefined;
      formRefTask.value?.resetFields();
    }
  });
  // #endregion
</script>

<template>
  <a-modal v-model:open="modelVisible" :title="title" style="width: 68%; min-height: 90vh; max-width: 1200px;">
    <a-form ref="formRefTask" :model="model" :label-col="labelCol" class="flex flex-col">
      <a-row :gutter="[16, 16]" class="mt-6">
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.message.userSearchField')" class="m-0">
            <a-select v-model:value="userSearchFields" :placeholder="$t('page.message.form.userSearchField')" :options="convertOptions(userSearchFieldsOptions)" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.message.userSearchKeyword')" class="m-0">
            <div style="display: flex; align-items: center; gap: 10px;">
              <a-input v-model:value="userSearchKeyWord" :placeholder="$t('page.message.form.userSearchKeyword')" />
              <a-button type="primary" class="blue-btn ml-3" @click="getData">{{$t('page.message.userSearch')}}</a-button>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="24" :lg="24">
          <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" size="small" :loading="loading" row-key="id" :pagination="pagination" class="h-full" bordered />
        </a-col>
      </a-row>
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
</style>
