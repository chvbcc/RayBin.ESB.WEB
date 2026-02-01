<script setup lang="ts">
import { $t } from '@/locales';
import { ref, onMounted } from 'vue';
import { TaskApi } from '@/service/api/task';
import { createReusableTemplate } from '@vueuse/core';

defineOptions({
  name: 'CardData'
});

interface CardData {
  key: string;
  title: string;
  value: number;
  color: {
    start: string;
    end: string;
  };
  icon: string;
  iconClass: string;
}

const cardData = ref<CardData[]>([
  {
    key: 'databaseTaskCount',
    title: $t('page.home.databaseTask'),
    value: 0,
    color: {
      start: '#ec4786',
      end: '#b955a4'
    },
    icon: 'icon-local-database',
      iconClass: 'text-29px',
  },
  {
    key: 'webApiTaskCount',
    title: $t('page.home.webApiTask'),
    value: 0,
    color: {
      start: '#865ec0',
      end: '#5144b4'
    },
    icon: 'icon-local-web',
    iconClass: 'text-32px',
  },
  {
    key: 'industriaTaskCount',
    title: $t('page.home.industryTask'),
    value: 0,
    color: {
      start: '#56cdf3',
      end: '#719de3'
    },
    icon: 'icon-local-industrial',
    iconClass: 'text-27px',
  },
  {
    key: 'dataMonitorTaskCount',
    title: $t('page.home.dataMonitorTask'),
    value: 0,
    color: {
      start: '#fcbc25',
      end: '#f68057'
    },
    icon: 'icon-local-monitor',
    iconClass: 'text-33px',
  }
]);

interface GradientBgProps {
  gradientColor: string;
}

const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();

function getGradientColor(color: CardData['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}

onMounted(async () => {
  const { error, data } = await TaskApi.fetchGetTaskCount();
  if (!error && data) {
    const { databaseTaskCount, webApiTaskCount, industriaTaskCount, dataMonitorTaskCount } = data;
    cardData.value[0].value = databaseTaskCount;
    cardData.value[1].value = webApiTaskCount;
    cardData.value[2].value = industriaTaskCount;
    cardData.value[3].value = dataMonitorTaskCount;
  }
});
</script>

<template>
  <ACard :bordered="false" size="small" class="card-wrapper">
    <!-- define component start: GradientBg -->
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div class="rd-8px px-16px pb-4px pt-8px text-white" :style="{ backgroundImage: gradientColor }">
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <!-- define component end: GradientBg -->
    <ARow :gutter="[16, 16]">
      <ACol v-for="item in cardData" :key="item.key" :span="24" :md="12" :lg="6">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <svg-icon :local-icon="item.icon" :class="item.iconClass" />
            <CountTo :start-value="1" :end-value="item.value" class="text-30px text-white dark:text-dark" />
          </div>
        </GradientBg>
      </ACol>
    </ARow>
  </ACard>
</template>

<style scoped></style>
