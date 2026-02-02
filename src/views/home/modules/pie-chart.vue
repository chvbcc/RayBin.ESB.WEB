<script setup lang="ts">
import { watch, onMounted, computed } from 'vue';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'PieChart'
});

const title = computed(() => $t('page.home.taskProportion'));
const appStore = useAppStore();

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

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'item'
  },
  title: {
    text: title.value,
    left: 'left',
    top: '2%',
    textStyle: {
        color: '#888888',
        fontWeight: 'normal',
        fontSize: 14
    }
  },
  legend: {
    bottom: '3%',
    left: 'center',
    itemHeight: 13,
    itemStyle: {
      borderWidth: 0,
    }
  },
  series: [
    {
      color: ['#ec4786', '#865ec0', '#56cdf3', '#fcbc25'],
      name: $t('page.home.taskProportion'),
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '46%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12'
        }
      },
      labelLine: {
        show: false
      },
      data: [] as { name: string; value: number }[]
    }
  ]
}));

onMounted(() => {
  if (domRef.value) {
    updateLocale();
  }
});

function updateLocale() {
  updateOptions((opts, factory) => {
    const originOpts = factory();
    opts.title.text = title.value;
    opts.series[0].name = originOpts.series[0].name;
    opts.series[0].data = [
      { name: $t('page.home.databaseTask').replace("Tasks",""), value: props.taskCountModel.databaseTaskCount },
      { name: $t('page.home.webApiTask').replace("Tasks",""), value: props.taskCountModel.webApiTaskCount },
      { name: $t('page.home.industryTask').replace("Tasks",""), value: props.taskCountModel.industriaTaskCount },
      { name: $t('page.home.dataMonitorTask').replace("Tasks",""), value: props.taskCountModel.dataMonitorTaskCount }
    ];
    return opts;
  });
}

// 添加监听 props 变化
watch(
  () => props.taskCountModel,
  () => {
    updateLocale();
  },
  { immediate: true } // 立即执行一次
);

// 删除了 mockData 函数和调用
watch(
  () => appStore.locale,
  () => {
    updateLocale();
  }
);
</script>

<template>
  <a-card :bordered="false" class="card-wrapper">
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </a-card>
</template>

<style scoped></style>
