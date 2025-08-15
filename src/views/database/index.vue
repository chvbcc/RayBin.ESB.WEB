<template>
  <div>
    <CustomAlert v-if="showAlert" message="error" description="这是一个居中的提示消息"  type="error" show-icon closable @close="handleClose" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CustomAlert from '@/components/custom/custom-alert.vue';

// 控制alert显示/隐藏的状态
const showAlert = ref(true);

// 关闭alert的处理函数
const handleClose = () => {
  showAlert.value = false;
  console.log('Alert 被关闭了');
};
</script>

<style scoped>
</style>
