<script setup lang="tsx">
import { watch } from 'vue';
import { $t, language } from '@/locales';

defineOptions({
  name: 'ConnectionSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.DeviceConnection.DeviceConnectionSearchParams>('model', { required: true });

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
    <a-form :model="model"  :label-col="labelCol" :labelWrap="true">
      <a-row :gutter="[16, 16]" wrap>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.deviceConnection.connectionName')" name="connectionName" class="m-0">
            <a-input v-model:value="model.connectionName" :placeholder="$t('page.connection.form.connectionName')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.deviceConnection.deviceName')" name="deviceName" class="m-0">
            <a-input v-model:value="model.deviceName" :placeholder="$t('page.deviceConnection.form.deviceName')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.deviceConnection.deviceModel')" name="deviceModel" class="m-0">
            <a-input v-model:value="model.deviceModel" :placeholder="$t('page.deviceConnection.form.deviceModel')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.deviceConnection.address')" name="address" class="m-0">
            <a-input v-model:value="model.address" :placeholder="$t('page.deviceConnection.form.address')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item label="&nbsp;" :colon="false" class="m-0">
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
