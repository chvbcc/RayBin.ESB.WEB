<script setup lang="tsx">
  import { watch } from 'vue';
  import { $t, language } from '@/locales';
  import { convertOptions } from '@/utils/common';
  import { enableStatusOptions } from '@/constants/options';

  defineOptions({
    name: 'MenuSearch'
  });

  interface Emits {
    (e: 'reset'): void;
    (e: 'search'): void;
  }

  const emit = defineEmits<Emits>();

  const model = defineModel<Api.SystemManage.MenuSearchParams>('model', { required: true });

  const labelCol = language() === 'en-US' ?  { style: { width: '130px' } } :  { style: { width: '90px' } };

  async function reset() {
    emit('reset');
  }

  async function search() {
    emit('search');
  }

  // Watch for language changes and update labelCol dynamically
  watch(language, (newLang) => {
    labelCol.style.width = newLang === 'en-US' ? '130px' : '90px';
  });
</script>

<template>
  <a-card :title="$t('common.search')" :bordered="false" class="card-wrapper">
    <a-form ref="formRef" :model="model" :label-col="labelCol">
      <a-row :gutter="[16, 16]" wrap>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.menu.name')" name="name" class="m-0">
            <a-input v-model:value="model.name" :placeholder="$t('page.manage.menu.form.name')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.menu.path')" name="path" class="m-0">
            <a-input v-model:value="model.path" :placeholder="$t('page.manage.menu.form.path')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.menu.title')" name="title" class="m-0">
            <a-input v-model:value="model.title" :placeholder="$t('page.manage.menu.form.title')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.manage.menu.status')" name="status" class="m-0">
            <a-select v-model:value="model.status":placeholder="$t('page.manage.menu.form.status')" :options="convertOptions(enableStatusOptions)" allow-clear />
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
