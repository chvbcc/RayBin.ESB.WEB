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

const model = defineModel<Api.AppTypes.ConnectionSearchParams>('model', { required: true });

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['role-search']">
      <NCollapseItem :title="$t('common.search')" name="role-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.connection.connectionName')"
              path="connectionName"
              class="pr-24px"
            >
              <NInput v-model:value="model.connectionName" :placeholder="$t('page.connection.form.connectionName')" />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.connection.databaseType')"
              path="databaseType"
              class="pr-24px"
            >
              <NSelect
                v-model:value="model.databaseType"
                :placeholder="$t('page.connection.form.databaseType')"
                :options="translateOptions(databaseTypeOptions)"
                clearable
              />
            </NFormItemGi>

            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.connection.form.hostName')"
              path="hostName"
              class="pr-24px"
            >
              <NInput v-model:value="model.hostName" :placeholder="$t('page.connection.form.hostName')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.connection.databases')" path="databases" class="pr-24px">
              <NInput v-model:value="model.databases" :placeholder="$t('page.connection.form.databases')" />
            </NFormItemGi>

            <NFormItemGi span="24 s:12 m:6">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
