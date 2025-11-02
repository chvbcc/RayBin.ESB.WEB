<script setup lang="ts">
import { $t } from '@/locales';
import { convertOptions } from '@/utils/common';
import { enableStatusOptions } from '@/constants/task';

defineOptions({
  name: 'UserSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.SystemManage.UserSearchParams>('model', { required: true });

const labelCol = { style: { width: '80px' } };

async function reset() {
  emit('reset');
}

async function search() {
  emit('search');
}
</script>

<template>
  <a-card :title="$t('common.search')" :bordered="false" class="card-wrapper">
    <a-form ref="formRef" :model="model" :label-col="labelCol">
      <a-row :gutter="[16, 16]" wrap>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.user.username')" name="userName" class="m-0">
            <a-input v-model:value="model.username" :placeholder="$t('page.manage.user.form.username')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.user.employeeName')" name="employeeName" class="m-0">
            <a-input v-model:value="model.employeeName" :placeholder="$t('page.manage.user.form.employeeName')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.user.email')" name="email" class="m-0">
            <a-input v-model:value="model.email" :placeholder="$t('page.manage.user.form.email')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.user.status')" name="userStatus" class="m-0">
            <a-select v-model:value="model.status":placeholder="$t('page.manage.user.form.status')" :options="convertOptions(enableStatusOptions)" allow-clear />
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
