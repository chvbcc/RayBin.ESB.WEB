<script setup lang="ts">
import { $t } from '@/locales';
import { computed, ref, watch } from 'vue';
import { RoleApi } from '@/service/api/manage';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  operateType: AntDesign.TableOperateType;
  rowData?: Api.SystemManage.User | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const { formRef, validate, resetFields } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<AntDesign.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

// 2. 定义默认模型
const model = ref<Api.SystemManage.UserModel>(createDefaultModel());

function createDefaultModel(): Api.SystemManage.UserModel {
  return {
    id: 0,
    username: '',
    password: '',
    userAvatar: '',
    employeeName: '',
    employeeNo: '',
    gender: '1',
    phone: '',
    email: '',
    weChat: '',
    dingDing: '',
    status: '1'
  };
}

type RuleKey = Extract<keyof Api.SystemManage.User, 'username' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = { username: defaultRequiredRule, status: defaultRequiredRule };

/** the enabled role options */
const userRoles = ref<CommonType.Option<number>[]>([]);
const roleOptions = ref<CommonType.Option<number>[]>([]);

async function getRoleOptions() {
  const { error, data } = await RoleApi.fetchGetList();
  if (!error) {
    roleOptions.value = data.map(item => ({
      label: item.roleName,
      value: item.id
    }));
  }
}

async function getUserRoles() {
  if (!model.value.id) return;
  const { error, data } = await RoleApi.fetchGetRoles(model.value.id);
  if (!error) {
    userRoles.value = data.map(item => ({
      label: item.roleName,
      value: item.id
    }));
  }
}

function handleInitModel() {
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    resetFields();
    getRoleOptions();
    getUserRoles();
  }
});
</script>

<template>
  <a-drawer v-model:open="visible" :title="title" :width="360">
    <a-form ref="formRef" layout="vertical" :model="model" :rules="rules">
      <a-form-item :label="$t('page.manage.user.username')" name="username">
        <a-input v-model:value="model.username" :placeholder="$t('page.manage.user.form.username')" />
      </a-form-item>
      <a-form-item :label="$t('page.manage.user.gender')" name="gender">
        <a-radio-group v-model:value="model.gender">
          <a-radio v-for="item in userGenderOptions" :key="item.value" :value="item.value">
            {{ $t(item.label) }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('page.manage.user.userAvatar')" name="userAvatar">
        <a-input v-model:value="model.userAvatar" :placeholder="$t('page.manage.user.form.userAvatar')" />
      </a-form-item>
      <a-form-item :label="$t('page.manage.user.employeeName')" name="employeeName">
        <a-input v-model:value="model.employeeName" :placeholder="$t('page.manage.user.form.employeeName')" />
      </a-form-item>
      <a-form-item :label="$t('page.manage.user.employeeNo')" name="employeeNo">
        <a-input v-model:value="model.employeeNo" :placeholder="$t('page.manage.user.form.employeeNo')" />
      </a-form-item>
      <a-form-item :label="$t('page.manage.user.phone')" name="phone">
        <a-input v-model:value="model.phone" :placeholder="$t('page.manage.user.form.phone')" />
      </a-form-item>
      <a-form-item :label="$t('page.manage.user.email')" name="email">
        <a-input v-model:value="model.email" :placeholder="$t('page.manage.user.form.email')" />
      </a-form-item>
      <a-form-item :label="$t('page.manage.user.status')" name="status">
        <a-radio-group v-model:value="model.status">
          <a-radio v-for="item in enableStatusOptions" :key="item.value" :value="item.value">
            {{ $t(item.label) }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('page.manage.user.userRoles')" name="userRoles">
        <a-select v-model:value="userRoles" mode="multiple" :options="roleOptions" :placeholder="$t('page.manage.user.form.userRoles')" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space :size="16">
        <a-button @click="closeDrawer">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<style scoped></style>
