<script setup lang="ts">
import { $t } from '@/locales';
import { useBoolean } from '@sa/hooks';
import { computed, ref, watch } from 'vue';
import { convertOptions } from '@/utils/common';
import MenuAuthModal from './menu-auth-modal.vue';
import ButtonAuthModal from './button-auth-modal.vue';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { enableStatusOptions, yesOrNoOptions } from '@/constants/business';

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
const { formRef, validate, resetFields } = useAntdForm();
const { defaultRequiredRule } = useFormRules();
const { bool: menuAuthVisible, setTrue: openMenuAuthModal } = useBoolean();
const { bool: buttonAuthVisible, setTrue: openButtonAuthModal } = useBoolean();

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

const rules: Record<RuleKey, App.Global.FormRule> = {
  roleName: defaultRequiredRule,
  isSystem: defaultRequiredRule,
  status: defaultRequiredRule
};

const roleId = computed(() => props.rowData?.id || -1);
const isEdit = computed(() => props.operateType === 'edit');

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
            {{ $t(item.label) }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('page.manage.role.description')" name="description">
        <a-input v-model:value="model.description" :placeholder="$t('page.manage.role.form.description')" />
      </a-form-item>
    </a-form>
    <a-space v-if="isEdit">
      <a-button @click="openMenuAuthModal">{{ $t('page.manage.role.menuAuth') }}</a-button>
      <MenuAuthModal v-model:visible="menuAuthVisible" :role-id="roleId" />
      <a-button @click="openButtonAuthModal">{{ $t('page.manage.role.buttonAuth') }}</a-button>
      <ButtonAuthModal v-model:visible="buttonAuthVisible" :role-id="roleId" />
    </a-space>
    <template #footer>
      <div class="flex-y-center justify-end gap-12px">
        <a-button @click="closeDrawer">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<style scoped></style>
