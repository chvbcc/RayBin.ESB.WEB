<script setup lang="ts">
import { $t } from '@/locales';
import { computed, ref, watch } from 'vue';
import { RoleApi, UserApi } from '@/service/api/manage';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';

defineOptions({
  name: 'UserOperate  Modal'
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

// 1. 定义标题
const title = computed(() => {
  const titles: Record<AntDesign.TableOperateType, string> = { add: $t('page.manage.user.addUser'), edit: $t('page.manage.user.editUser') };
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
    status: 0,
  };
}

// 3. 定义表单验证规则
type RuleKey = Extract<keyof Api.SystemManage.User, 'username' | 'password' | 'employeeName' | 'email' | 'status'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => ({
  username: {
    required: true,
    validator: async (_rule: any, value: string) => {
      const userName = (value ?? '').trim();
      if (!userName) {
        return Promise.reject(new Error(($t('page.manage.user.form.username') as string)));
      }
      if (userName.length < 3 || userName.length > 20) {
        return Promise.reject(new Error(($t('page.manage.user.form.usernameLength') as string)));
      }
      const { response } = await UserApi.fetchCheckUserName(userName, model.value.id);
      const data = response.data as { code: string; msg: string; data: boolean };
      if (data.msg==="success" && data.data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    },
    trigger: 'blur'
  },
  password: model.value.id === 0
    ? { required: true, min: 6, max: 20, message: $t('page.manage.user.form.passwordLength'), trigger: 'blur' }
    : { required: false, min: 0, max: 20, message: $t('page.manage.user.form.passwordLength'), trigger: 'blur' },
  employeeName: defaultRequiredRule,
  email: {
    required: true,
    validator: async (_rule: any, value: string) => {
      const email = (value ?? '').trim();
      if (!email) {
        return Promise.reject(new Error(($t('page.manage.user.form.email') as string)));
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return Promise.reject(new Error(($t('page.manage.user.form.email') as string)));
      }
      const { response } = await UserApi.fetchCheckEmail(email, model.value.id);
      const data = response.data as { code: string; msg: string; data: boolean };
      if (data.msg==="success" && data.data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    },
    trigger: 'blur'
  },
  status: defaultRequiredRule
}));

// 4. 用户角色和角色选项
const userRoles = ref<number[]>([]);
const roleOptions = ref<CommonType.Option<number>[]>([]);

// 5. 获取角色选项
async function getRoleOptions() {
  const { error, data } = await RoleApi.fetchGetList();
  if (!error) {
    roleOptions.value = data.map(item => ({
      label: item.roleName,
      value: item.id
    }));
  }
}

// 6. 获取用户角色
async function getUserRoles() {
  if (!model.value.id) return;
  const { error, data } = await RoleApi.fetchGetRoles(model.value.id);
  if (!error) {
    userRoles.value = data.map(item => item.id);
  }
}

// 7. 初始化模型
function handleInitModel() {
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, {
      ...props.rowData,
      password: ''
    });
  }
}

// 8. 关闭模态框
function closeModal() {
  visible.value = false;
}

// 9. 提交表单
async function handleSubmit() {
  await validate();
  const submitData = { ...model.value, userRoles: userRoles.value };
  await UserApi.fetchSave(submitData);
  window.$message?.success($t('common.updateSuccess'));
  closeModal();
  emit('submitted');
}

// 10. 监听模态框状态
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
  <a-modal v-model:open="visible" :title="title" width="900px">
    <div class="h-718px overflow-y-auto">
      <a-form ref="formRef" :model="model" :rules="rules" :label-col="{ span: 5 }" class="pr-20px">
        <a-row :gutter="[16, 16]">
          <a-col :span="22">
            <a-form-item :label="$t('page.manage.user.username')" name="username">
              <a-input v-model:value="model.username" :placeholder="$t('page.manage.user.form.username')" />
            </a-form-item>
          </a-col>
          <a-col :span="22">
            <a-form-item :label="$t('page.manage.user.password')" name="password">
                <a-input-password v-model:value="model.password" :placeholder="$t('page.manage.user.form.password')" />
            </a-form-item>
          </a-col>
          <a-col :span="22">
            <a-form-item :label="$t('page.manage.user.gender')" name="gender">
              <a-radio-group v-model:value="model.gender">
                <a-radio v-for="item in userGenderOptions" :key="item.value" :value="item.value">
                  {{ $t(item.label) }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="22">
            <a-form-item :label="$t('page.manage.user.userAvatar')" name="userAvatar">
              <a-input v-model:value="model.userAvatar" :placeholder="$t('page.manage.user.form.userAvatar')" />
            </a-form-item>
          </a-col>
          <a-col :span="22">
            <a-form-item :label="$t('page.manage.user.employeeName')" name="employeeName">
              <a-input v-model:value="model.employeeName" :placeholder="$t('page.manage.user.form.employeeName')" />
            </a-form-item>
          </a-col>
          <a-col :span="22">
            <a-form-item :label="$t('page.manage.user.employeeNo')" name="employeeNo">
              <a-input v-model:value="model.employeeNo" :placeholder="$t('page.manage.user.form.employeeNo')" />
            </a-form-item>
          </a-col>
          <a-col :span="22">
            <a-form-item :label="$t('page.manage.user.phone')" name="phone">
              <a-input v-model:value="model.phone" :placeholder="$t('page.manage.user.form.phone')" />
            </a-form-item>
          </a-col>
          <a-col :span="22">
            <a-form-item :label="$t('page.manage.user.email')" name="email">
              <a-input v-model:value="model.email" :placeholder="$t('page.manage.user.form.email')" />
            </a-form-item>
          </a-col>
          <a-col :span="22">
            <a-form-item :label="$t('page.manage.user.status')" name="status">
              <a-radio-group v-model:value="model.status">
                <a-radio v-for="item in enableStatusOptions" :key="item.value" :value="item.value">
                  {{ $t(item.label) }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="22">
            <a-form-item :label="$t('page.manage.user.userRoles')" name="userRoles">
              <a-select v-model:value="userRoles" mode="multiple" :options="roleOptions" :placeholder="$t('page.manage.user.form.userRoles')" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <template #footer>
      <a-space :size="13">
        <a-button @click="closeModal">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped></style>
