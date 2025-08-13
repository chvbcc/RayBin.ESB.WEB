<script setup lang="ts">
import { databaseTypeOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({
  name: 'ConnectionSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.ConnectionTypes.ConnectionSearchParams>('model', { required: true });

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}
</script>

<template>
  <a-card :title="$t('common.search')" :bordered="false" class="card-wrapper">
    <a-form :model="model"  :label-col="{ style: { width: '88px' } }" >
      <a-row :gutter="[16, 16]" wrap>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.connection.connectionName')" name="connectionName" class="m-0">
            <a-input v-model:value="model.connectionName" :placeholder="$t('page.connection.form.connectionName')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.connection.databaseType')" name="databaseType" class="m-0">
            <a-select v-model:value="model.databaseType" :placeholder="$t('page.connection.form.databaseType')" :options="translateOptions(databaseTypeOptions)" allow-clear>
            </a-select>
          </a-form-item>
        </a-col>
        <ACol :span="24" :md="12" :lg="12">
          <AFormItem :label="$t('page.connection.hostName')" name="hostName" class="m-0">
            <AInput v-model:value="model.hostName" :placeholder="$t('page.connection.form.hostName')" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="12">
          <AFormItem :label="$t('page.connection.databases')" name="databases" class="m-0">
            <AInput v-model:value="model.databases" :placeholder="$t('page.connection.form.databases')" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="12">
          <AFormItem class="m-0">
            <div class="w-full flex-y-center justify-start gap-12px searchAlign">
              <AButton type="primary" ghost @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="align-sub text-icon" />
                  </template>
                  <span class="ml-8px">{{ $t('common.reset') }}</span>
              </AButton>
              <AButton type="primary" ghost @click="search">
                <template #icon>
                  <icon-ic-round-search class="align-sub text-icon" />
                </template>
                <span class="ml-8px">{{ $t('common.search') }}</span>
              </AButton>
            </div>
          </AFormItem>
        </ACol>
      </a-row>
    </a-form>
  </a-card>
</template>

<style scoped></style>
