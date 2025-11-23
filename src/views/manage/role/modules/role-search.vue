<script setup lang="ts">
import { watch } from 'vue';
import { $t, language } from '@/locales';
import { convertOptions } from '@/utils/common';
import { enableStatusOptions, yesOrNoOptions } from '@/constants/options';

defineOptions({
  name: 'RoleSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.SystemManage.RoleSearchParams>('model', { required: true });

const labelCol = language() === 'en-US' ?  { style: { width: '130px' } } :  { style: { width: '90px' } };

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}

// Watch for language changes and update labelCol dynamically
watch(language, (newLang) => {
  labelCol.style.width = newLang === 'en-US' ? '130px' : '90px';
});
</script>

<template>
  <a-card :title="$t('common.search')" :bordered="false" class="card-wrapper">
    <a-form :model="model" :label-col="labelCol" class="mr-3">
      <a-row :gutter="[16, 16]" wrap>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.role.roleName')" name="roleName" class="m-0">
            <a-input v-model:value="model.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.role.isSystem')" name="isSystem" class="m-0">
            <a-select v-model:value="model.isSystem" :placeholder="$t('page.manage.role.form.isSystem')" :options="convertOptions(yesOrNoOptions)" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.role.description')" name="description" class="m-0">
            <a-input v-model:value="model.description" :placeholder="$t('page.manage.role.form.description')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.role.status')" name="status" class="m-0">
            <a-select v-model:value="model.status":placeholder="$t('page.manage.role.form.status')" :options="convertOptions(enableStatusOptions)" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item class="m-0" label="&nbsp;" :colon="false">
            <div class="w-full flex-y-center justify-start gap-12px">
              <a-button type="primary" ghost @click="reset">
                <template #icon>
                  <icon-ic-round-refresh class="align-sub text-icon" />
                </template>
                <span class="ml-8px">{{ $t('common.reset') }}</span>
              </a-button>
              <a-button type="primary" ghost @click="search">
                <template #icon>
                  <icon-ic-round-search class="align-sub text-icon" />
                </template>
                <span class="ml-8px">{{ $t('common.search') }}</span>
              </a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<style scoped></style>
