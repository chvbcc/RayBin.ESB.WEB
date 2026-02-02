<script setup lang="ts">
import { $t } from '@/locales';
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

defineOptions({
  name: 'CardData'
});

interface TaskCountModel {
  databaseTaskCount: number;
  webApiTaskCount: number;
  industriaTaskCount: number;
  dataMonitorTaskCount: number;
}

interface Props {
  taskCountModel: TaskCountModel;
}

const props = withDefaults(defineProps<Props>(), {
  taskCountModel: () => ({
    databaseTaskCount: 0,
    webApiTaskCount: 0,
    industriaTaskCount: 0,
    dataMonitorTaskCount: 0
  })
});

interface CardData {
  key: string;
  title: string;
  titleKey: App.I18n.I18nKey;
  value: number;
  color: {
    start: string;
    end: string;
  };
  icon: string;
  iconClass: string;
}

const cardData = computed(() => [
  {
    key: 'databaseTaskCount',
    value: props.taskCountModel.databaseTaskCount,
    title: $t('page.home.databaseTask'),
    color: {
      start: '#ec4786',
      end: '#b955a4'
    },
    icon: 'icon-local-database',
    iconClass: 'text-29px',
  },
  {
    key: 'webApiTaskCount',
    value: props.taskCountModel.webApiTaskCount,
    title: $t('page.home.webApiTask'),
    color: {
      start: '#865ec0',
      end: '#5144b4'
    },
    icon: 'icon-local-web',
    iconClass: 'text-32px',
  },
  {
    key: 'industriaTaskCount',
    value: props.taskCountModel.industriaTaskCount,
    title: $t('page.home.industryTask'),
    color: {
      start: '#56cdf3',
      end: '#719de3'
    },
    icon: 'icon-local-industrial',
    iconClass: 'text-27px',
  },
  {
    key: 'dataMonitorTaskCount',
    value: props.taskCountModel.dataMonitorTaskCount,
    title: $t('page.home.dataMonitorTask'),
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
</script>

<template>
  <a-card :bordered="false" size="small" class="card-wrapper">
    <!-- define component start: GradientBg -->
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div class="rd-8px px-16px pb-4px pt-8px text-white" :style="{ backgroundImage: gradientColor }">
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <!-- define component end: GradientBg -->
    <a-row :gutter="[16, 16]">
      <a-col v-for="item in cardData" :key="item.key" :span="24" :md="12" :lg="6">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <svg-icon :local-icon="item.icon" :class="item.iconClass" />
            <span class="text-30px text-white dark:text-dark">{{ item.value }}</span>
          </div>
        </GradientBg>
      </a-col>
    </a-row>
  </a-card>
</template>

<style scoped></style>
