<script setup lang="tsx">
  import { $t, language } from '@/locales';
  import { convertOptions } from '@/utils/common';
  import type { FormInstance } from 'ant-design-vue';
  import { computed, ref, watch, nextTick } from 'vue';
  import { fetchUpdate } from '@/service/api/message';
  import { messageTypeOptions, messageInsertFieldsOptions } from '@/constants/options';

  // 定义组件名称
  defineOptions({
    name: 'MessageModal'
  });

  // 组件属性定义
  interface Props {
    id: number;
    messageType: Api.Message.MessageType;
    emailSubject: string;
    messageContent: string;
  }

  // #region 3. 组件事件
  const emit = defineEmits([
    'confirm',
  ])

  // #endregion
  const messageContentRef = ref();
  const props = defineProps<Props>();
  const formRefTask = ref<FormInstance>();
  const title = computed(() => {return $t('page.message.messageEdit');});
  const messageFields = ref<Api.Message.MessageInsertFields | 0>();
  const visible = defineModel<boolean>('visible', { default: false });
  const model = ref<Api.Message.MessageModel>({} as Api.Message.MessageModel);
  const labelCol = computed(() =>language() === 'en-US' ?  { style: { width: '141px' } } :  { style: { width: '100px' } });
  // #endregion

  // #region 6. 插入字段
  async function handleInsert() {
    if (messageFields.value === undefined || messageFields.value === null) return;
    // 获取文本框的当前值和光标位置
    const textarea: HTMLTextAreaElement | null =
      messageContentRef.value?.resizableTextArea?.textArea ||
      messageContentRef.value?.$el?.querySelector('textarea') ||
      null;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const content = model.value.messageContent || '';

    // 在光标位置插入字段的值
    const fieldText = `{${messageFields.value}}`;
    const newContent = content.substring(0, start) + fieldText + content.substring(end);

    // 更新模型值
    model.value.messageContent = newContent;

    // 重新设置光标位置到插入内容之后
    nextTick(() => {
      const newCursorPosition = start + fieldText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    });
  }
  // #endregion

  // #region 7. 确认
  async function handleConfirm() {
    formRefTask.value?.validate().then(async () => {
      debugger
      const { error } = await fetchUpdate(model.value);
      if (error) return;
      emit('confirm');
      closeModal();
    });
  }
  // #endregion

  // #region 8. 关闭模态框
  function closeModal() {
    visible.value = false;
  }
  // #endregion

  // #region 9. 监听弹出框的显示状态
  watch(visible, async (newVal) => {
    if (newVal) {
      model.value.id= props.id;
      model.value.messageType = Number(props.messageType) as Api.Message.MessageType;
      model.value.emailSubject = props.emailSubject;
      model.value.messageContent = props.messageContent;
    } else {
      messageFields.value = undefined;
      formRefTask.value?.resetFields();
    }
  });
  // #endregion
</script>

<template>
  <a-modal v-model:open="visible" :title="title" style="width: 90%; height: 70vh; max-width: 800px;">
    <a-form ref="formRefTask" :model="model" :label-col="labelCol" class="flex flex-col">
      <a-row :gutter="[16, 16]" class="mrt16">
        <a-col :span="24" :md="24" :lg="24">
          <a-form-item :label="$t('page.message.messageType')" name="messageType" class="m-0" :rules="[{ required: true}]">
            <a-select v-model:value="model.messageType" :placeholder="$t('page.message.form.messageType')" :options="convertOptions(messageTypeOptions)" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="24" :lg="24">
          <a-form-item :label="$t('page.message.emailSubject')" name="emailSubject" class="m-0" :rules="[{ required: model.messageType === 3}]">
            <a-input v-model:value="model.emailSubject" :rows="4" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="24" :lg="24">
          <a-form-item :label="$t('page.message.messageField')" name="messageFields" class="m-0">
            <div style="display: flex; align-items: center; gap: 10px;">
              <a-select v-model:value="messageFields" :placeholder="$t('page.message.form.messageField')" :options="convertOptions(messageInsertFieldsOptions)" allow-clear />
              <a-button type="primary" class="orange-btn ml-3" @click="handleInsert">{{$t('page.message.messageInsert')}}</a-button>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="24" :lg="24">
          <a-form-item :label="$t('page.message.messageContent')" name="messageContent" class="m-0" :rules="[{ required: true}]">
            <a-textarea ref="messageContentRef" v-model:value="model.messageContent" :rows="4" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <a-space :size="13" class="mr-5 mt-3">
        <a-button @click="closeModal">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped>
 .mrt16 { margin-right: 16px !important; margin-top: 16px !important;  }
 .mltr16 { margin-left: 16px !important; margin-top: 16px !important; margin-right: 16px !important; }
</style>
