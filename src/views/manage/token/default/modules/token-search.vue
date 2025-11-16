<script setup lang="ts">
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { watch, computed } from 'vue';
import { $t, language } from '@/locales';
import { methodOptions } from '@/constants/token';

defineOptions({
  name: 'TokenSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

type RangeValue = [Dayjs, Dayjs];

const emit = defineEmits<Emits>();

const model = defineModel<Api.SystemManage.TokenSearchParams>('model', { required: true });

const labelCol = language() === 'en-US' ?  { style: { width: '130px' } } :  { style: { width: '90px' } };

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
watch(language, (newLang) => {
  labelCol.style.width = newLang === 'en-US' ? '130px' : '90px';
});
</script>

<template>
  <a-card :title="$t('common.search')" :bordered="false" class="card-wrapper">
    <a-form :model="model"  :label-col="labelCol" :labelWrap="true">
      <a-row :gutter="[16, 16]" wrap>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.token.tokenName')" name="tokenName" class="m-0">
            <a-input v-model:value="model.tokenName" :placeholder="$t('page.token.form.tokenName')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.token.method')" name="method" class="m-0">
            <a-select v-model:value="model.method" :placeholder="$t('page.token.form.method')" :options="methodOptions" allow-clear>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.token.requestUrl')" name="requestUrl" class="m-0">
            <a-input v-model:value="model.requestUrl" :placeholder="$t('page.token.form.requestUrl')" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="12">
          <a-form-item :label="$t('page.token.createTime')" name="createTime" class="m-0">
            <a-range-picker v-model:value="dateRange" :style="{ width: '100%' }" />
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
