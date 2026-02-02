<script setup lang="ts">
import { $t, language } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';
import { ref, computed, onMounted, onUnmounted } from 'vue';

defineOptions({
  name: 'HeaderBanner'
});

const realTime = ref('');
const authStore = useAuthStore();
let timer: NodeJS.Timeout | null = null;

interface Props {
  taskCount: number,
  pendingTaskCount: number,
  suspendedTaskCount: number,
}

const props = defineProps<Props>();

const statisticData = computed(() => [
  {
    id: 0,
    title: $t('page.home.taskCount'),
    value: props.taskCount
  },
  {
    id: 1,
    title: $t('page.home.pendingTaskCount'),
    value: props.pendingTaskCount
  },
  {
    id: 2,
    title: $t('page.home.suspendedTaskCount'),
    value: props.suspendedTaskCount
  }
]);


function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) {
    return $t('page.home.goodMorning', { userName: authStore.userInfo.userName });
  } else if (hour >= 12 && hour < 18) {
    return $t('page.home.goodAfternoon', { userName: authStore.userInfo.userName });
  } else {
    return $t('page.home.goodEvening', { userName: authStore.userInfo.userName });
  }
}

function getNowTime(targetDate: Date = new Date()): string {
  if (language() === 'zh-CN') {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Shanghai'
    }).format(targetDate).replace(/\//g, '-');
  } else {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 关闭12小时制，无AM/PM
      timeZone: 'Asia/Shanghai'
    }).format(targetDate);
  }
}

// 初始化并更新时间
const updateTime = () => {
  realTime.value = getNowTime();
};

onMounted(async() => {
  updateTime(); // 页面加载时立即执行
  timer = setInterval(updateTime, 1000); // 每秒刷新
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <a-card :bordered="false" class="card-wrapper">
    <a-row :gutter="[16, 16]">
      <a-col :span="24" :md="18">
        <div class="flex-y-center">
          <div class="size-72px shrink-0 overflow-hidden rd-1/2">
            <img src="@/assets/imgs/soybean.jpg" class="size-full" />
          </div>
          <div class="pl-12px">
            <h3 class="text-18px font-semibold">
              {{ getGreeting() }}
            </h3>
            <p class="text-#999 leading-30px">{{ realTime }}</p>
          </div>
        </div>
      </a-col>
      <a-col :span="24" :md="6">
        <a-space class="w-full justify-end" :size="24">
            <a-statistic v-for="item in statisticData" :key="item.id" class="whitespace-nowrap" :title="item.title" :value="item.value" />
        </a-space>
      </a-col>
    </a-row>
  </a-card>
</template>

<style scoped></style>
