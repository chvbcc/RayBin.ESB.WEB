<script setup lang="ts">
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { computed, watch } from 'vue';
import { $t, language } from '@/locales';
import { methodOptions } from '@/constants/options';

defineOptions({
  name: 'AuthorizeSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

type RangeValue = [Dayjs, Dayjs];

const emit = defineEmits<Emits>();

const model = defineModel<Api.Authorize.AuthorizeSearchParams>('model', { required: true });

const labelCol = language() === 'en-US' ? { style: { width: '130px' } } : { style: { width: '90px' } };

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}

const isoFormat = 'YYYY-MM-DDTHH:mm:ss';

const dateRange = computed<RangeValue | undefined>({
  get: () => {
    const { startCreateTime, endCreateTime } = model.value;
    if (startCreateTime && endCreateTime) {
      return [dayjs(startCreateTime), dayjs(endCreateTime)] as RangeValue;
    }
    return undefined;
  },
  set: value => {
    if (value && value.length === 2) {
      model.value.startCreateTime = value[0].format(isoFormat);
      model.value.endCreateTime = value[1].format(isoFormat);
    } else {
      model.value.startCreateTime = undefined;
      model.value.endCreateTime = undefined;
    }
  }
});

// Watch for language changes and update labelCol dynamically
watch(language, newLang => {
  labelCol.style.width = newLang === 'en-US' ? '130px' : '90px';
});
</script>

<template>
  <ACard :title="$t('common.search')" :bordered="false" class="card-wrapper">
    <AForm :model="model" :label-col="labelCol" :label-wrap="true">
      <ARow :gutter="[16, 16]" wrap>
        <ACol :span="24" :md="12" :lg="12">
          <AFormItem :label="$t('page.authorize.name')" name="name" class="m-0">
            <AInput v-model:value="model.name" :placeholder="$t('page.authorize.form.name')" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="12">
          <AFormItem :label="$t('page.authorize.method')" name="method" class="m-0">
            <ASelect
              v-model:value="model.method"
              :placeholder="$t('page.authorize.form.method')"
              :options="methodOptions"
              allow-clear
            ></ASelect>
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="12">
          <AFormItem :label="$t('page.authorize.requestUrl')" name="requestUrl" class="m-0">
            <AInput v-model:value="model.requestUrl" :placeholder="$t('page.authorize.form.requestUrl')" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="12">
          <AFormItem :label="$t('page.authorize.createTime')" name="createTime" class="m-0">
            <ARangePicker v-model:value="dateRange" :style="{ width: '100%' }" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="12">
          <AFormItem label="&nbsp;" :colon="false" class="m-0">
            <div class="w-full flex-y-center justify-start gap-12px">
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
      </ARow>
    </AForm>
  </ACard>
</template>

<style scoped></style>
