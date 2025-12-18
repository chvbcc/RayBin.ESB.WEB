<script setup lang="ts">
import { $t } from '@/locales';
import { computed, ref, watch } from 'vue';
import { RoleApi } from '@/service/api/manage';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { convertOptions, getPromptMessage } from '@/utils/common';
import { enableStatusOptions, yesOrNoOptions } from '@/constants/options';

defineOptions({
  name: 'RoleOperateDrawer'
});

interface Props {
  operateType: AntDesign.TableOperateType;
  rowData?: Api.SystemManage.Role | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });
const { validate, resetFields } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<AntDesign.TableOperateType, string> = {
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole')
  };
  return titles[props.operateType];
});

const model = ref(createDefaultModel());

function createDefaultModel(): Api.SystemManage.RoleModel {
  return {
    id: 0,
    roleName: '',
    isSystem: 0,
    description: '',
    status: 0
  };
}

type RuleKey = Extract<keyof Api.SystemManage.RoleModel, 'roleName' | 'isSystem' | 'status'>;

const rules =computed<Record<RuleKey, App.Global.FormRule>>(() => ({
  roleName: {
    required: true,
    validator: async (_rule: any, value: string) => {
      const name = (value ?? '').trim();
      if (!name) {
        return Promise.reject(new Error(($t('page.manage.role.form.roleName') as string)));
      }
      const { response } = await RoleApi.fetchCheckName(name, model.value.id);
      const data = response.data as { code: string; msg: string; data: boolean };
      if (data.msg==="success" && data.data) {
        return Promise.reject(new Error($t('common.exists')));
      }
      return Promise.resolve();
    },
    trigger: 'blur'
  },
  isSystem: defaultRequiredRule,
  status: defaultRequiredRule
}));

function handleInitModel() {
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    // 使用解构赋值避免布尔值类型转换问题
    const { isSystem, ...restData } = props.rowData;
    // 确保isSystem保持为数字类型（0或1）
    Object.assign(model.value, restData, {
      isSystem: Number(isSystem) // 显式转换为数字，确保与选项value类型匹配
    });
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  const submitData = { ...model.value};
  const { error, response } = await RoleApi.fetchSave(submitData);
  if (error) { window.$message?.error(getPromptMessage(props.operateType, "Failed")); return; }
  const result = response.data as { code: string; msg: string; data: boolean };
  if (result.msg==="success") {
    window.$message?.success(getPromptMessage(props.operateType, "Success"));
    closeDrawer();
    emit('submitted');
  } else if (result.msg==="fail") {
    window.$message?.error(result.data);
  } else {
    window.$message?.error(getPromptMessage(props.operateType, "Failed"));
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    resetFields();
  }
});
</script>

<template>
  <a-drawer v-model:open="visible" :title="title" :width="360">
    <a-form ref="formRef" layout="vertical" :model="model" :rules="rules">
      <a-form-item :label="$t('page.manage.role.roleName')" name="roleName">
        <a-input v-model:value="model.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
      </a-form-item>
      <a-form-item :label="$t('page.manage.role.isSystem')" name="isSystem">
        <a-select v-model:value="model.isSystem" :placeholder="$t('page.manage.role.form.isSystem')" :options="convertOptions(yesOrNoOptions)" allow-clear />
      </a-form-item>
      <a-form-item :label="$t('page.manage.role.status')" name="status">
        <a-radio-group v-model:value="model.status">
          <a-radio v-for="item in enableStatusOptions" :key="item.value" :value="item.value">
            {{ $t(item.label as App.I18n.I18nKey) }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('page.manage.role.description')" name="description">
        <a-input v-model:value="model.description" :placeholder="$t('page.manage.role.form.description')" />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex-y-center justify-end gap-12px">
        <a-button @click="closeDrawer">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<style scoped></style>
