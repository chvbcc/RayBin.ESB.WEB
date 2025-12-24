<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';

const editor = shallowRef();

// 定义组件名称
defineOptions({
  name: 'TokenModal'
});

// 定义属性
interface Props {
  programmeLanguage: string;
}

// 定义事件
const props = defineProps<Props>();
const emit = defineEmits(['update:visible', 'confirm']);
const visible = defineModel<boolean>('visible', { default: false });
const lang = ref<'csharp' | 'python'>('python');

const defaultCsharpCode = `
  // This C# Code Example
  // Task starts before execution
  void GetToken() {

  }
`;

const defaultPythonCode = `
  # This Python Code Example
  # Task starts before execution
  def getToken():
      pass
`;

// 编辑器内容
const code = ref<string>(props.programmeLanguage === '7001' ? defaultPythonCode : defaultCsharpCode);

// 编辑器选项
const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true
};

function handleEditorMount(editorInstance: any) {
  editor.value = editorInstance;
}

// 获取编辑器内容
function getEditorContent() {
  if (editor.value) {
    const content = editor.value.getValue();
    return content;
  }
  return null;
}

// 处理确定按钮
function handleConfirm() {
  const content = getEditorContent(); // 获取编辑器内容
  emit('confirm', content);
  visible.value = false;
}

// 处理取消按钮
function handleCancel() {
  visible.value = false;
  emit('update:visible', false);
}

watch(
  () => props.programmeLanguage,
  newLang => {
    if (newLang === '7000') {
      lang.value = 'csharp';
      // 如果是新打开的编辑器且内容是默认值，才更新
      if (code.value === defaultPythonCode) {
        code.value = defaultCsharpCode;
      }
    } else {
      lang.value = 'python';
      // 如果是新打开的编辑器且内容是默认值，才更新
      if (code.value === defaultCsharpCode) {
        code.value = defaultPythonCode;
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <a-modal v-model:open="visible" title="Code Editor" style="width: 90%; max-height: 60vh">
    <VueMonacoEditor v-model:value="code" theme="vs-dark" :options="MONACO_EDITOR_OPTIONS" :language="lang" style="width: 100%; height: 800px" @mount="handleEditorMount" />
    <template #footer>
      <a-space :size="13">
        <a-button @click="handleCancel">{{ $t('common.cancel') }}</a-button>
        <a-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style scoped></style>
