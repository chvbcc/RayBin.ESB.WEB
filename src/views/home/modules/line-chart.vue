<script setup lang="ts">
import { $t } from '@/locales';
import { computed, watch, onMounted } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'LineChart'
});

const appStore = useAppStore();
const title = computed(() => $t('page.home.taskSpentTime'));

interface TaskSpentTimeModel {
  databaseTaskSpentTime: number[];
  webApiTaskSpentTime: number[];
  industriaTaskSpentTime: number[];
  dataMonitorTaskSpentTime: number[];
}

interface Props {
  taskSpentTimeModel: TaskSpentTimeModel;
}
const props = withDefaults(defineProps<Props>(), {
  taskSpentTimeModel: () => ({
    databaseTaskSpentTime: [],
    webApiTaskSpentTime: [],
    industriaTaskSpentTime: [],
    dataMonitorTaskSpentTime: []
  })
});

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  title: {
    text: title.value,
    left: 'left',
    top: '0',
    textStyle: {
        color: '#888888',
        fontWeight: 'normal',
        fontSize: 14
    }
  },
  legend: {
    data: [$t('page.home.databaseTask'), $t('page.home.webApiTask'), $t('page.home.industryTask'), $t('page.home.dataMonitorTask')]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1', '2', '3', '4', '5', '6', '7'],
  },
  yAxis: {
    type: 'value'
  },
   series: [
    {
      color: '#ec4786',
      name: $t('page.home.databaseTask'),
      type: 'line',
      smooth: true,
      stack: 'Total',
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    },
    {
      color: '#865ec0',
      name: $t('page.home.webApiTask'),
      type: 'line',
      smooth: true,
      stack: 'Total',
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    },
    {
      color: '#56cdf3',
      name: $t('page.home.industryTask'),
      type: 'line',
      smooth: true,
      stack: 'Total',
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    },
    {
      color: '#fcbc25',
      name: $t('page.home.dataMonitorTask'),
      type: 'line',
      smooth: true,
      stack: 'Total',
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    }
  ]
}));

function updateLocale() {
  updateOptions((opts, factory) => {
    const originOpts = factory();
    opts.legend.data = originOpts.legend.data;
    opts.title.text = title.value;
    opts.series[0].name = originOpts.series[0].name;
    opts.series[1].name = originOpts.series[1].name;
    opts.series[2].name = originOpts.series[2].name;
    opts.series[3].name = originOpts.series[3].name;

    opts.series[0].data = props.taskSpentTimeModel.databaseTaskSpentTime;
    opts.series[1].data = props.taskSpentTimeModel.webApiTaskSpentTime;
    opts.series[2].data = props.taskSpentTimeModel.industriaTaskSpentTime;
    opts.series[3].data = props.taskSpentTimeModel.dataMonitorTaskSpentTime;
    return opts;
  });
}
// 添加监听 props 变化
watch(
  () => props.taskSpentTimeModel,
  () => {
    updateLocale();
  },
  { immediate: true } // 立即执行一次
);

watch(
  () => appStore.locale,
  () => {
    updateLocale();
  }
);

onMounted(() => {
  if (domRef.value) {
    updateLocale();
  }
});
</script>

<template>
  <a-card :bordered="false" class="card-wrapper">
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </a-card>
</template>

<style scoped></style>
