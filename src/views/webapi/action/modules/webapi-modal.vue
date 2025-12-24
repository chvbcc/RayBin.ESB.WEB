<script setup lang="ts">
import RequestBody from '@/components/webapi/request/request-body.vue';

// 定义事件
const emit = defineEmits(['update:visible', 'confirm']);
const visible = defineModel<boolean>('visible', { default: false });

// 处理确定按钮
function handleConfirm() {
  emit('confirm', null);
  visible.value = false;
}

// 处理取消按钮
function handleCancel() {
  visible.value = false;
  emit('update:visible', false);
}
</script>

<template>
  <a-form ref="formRef" layout="vertical">
    <a-modal v-model:open="visible" :title="$t('page.webApi.requestInterface')" style="width: 90%; height: 80vh">



      <template #footer>
        <a-space :size="13">
          <a-button @click="handleCancel">{{ $t('common.cancel') }}</a-button>
          <a-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</a-button>
        </a-space>
      </template>
    </a-modal>
  </a-form>
</template>

<style scoped></style>
