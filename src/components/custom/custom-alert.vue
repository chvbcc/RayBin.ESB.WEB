<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import type { CSSProperties } from 'vue';

defineOptions({
  name: 'CustomAlert'
});

export interface CustomAlertProps {
  description: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  showIcon?: boolean;
  closable?: boolean;
}

// 正确定义props和emits在顶级作用域
const props = defineProps<CustomAlertProps>();
const { description, message, type, showIcon, closable } = props;
const emit = defineEmits<{(e: 'close'): void;}>();

const alertRef = ref<HTMLDivElement | null>(null);
const windowSize = ref<{width: number; height: number;}>({ width: typeof window !== 'undefined' ? window.innerWidth : 0, height: typeof window !== 'undefined' ? window.innerHeight : 0,});

// 计算容器样式，实现居中
const containerStyle = computed<CSSProperties>(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}));

// 处理关闭事件
const handleClose = () => {
  emit('close');
};

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  nextTick(() => {
    if (alertRef.value && !alertRef.value.contains(event.target as Node)) {
      handleClose();
    }
  });
};

// 监听窗口大小变化
const handleResize = () => {
  if (typeof window !== 'undefined') {
    windowSize.value = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    console.log('窗口大小变化:', windowSize.value);
  }
};

// 组件挂载时添加事件监听
onMounted(() => {
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
  }, 0);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div :style="containerStyle">
    <div class="alert-wrapper" ref="alertRef">
      <a-alert :show-icon="showIcon" :description="description" :message="message" :type="type" :closable="closable" @close="handleClose" />
    </div>
  </div>
</template>

<style scoped>
.alert-wrapper {
  max-width: 600px;
  width: 90%;
  box-sizing: border-box;
}
</style>
