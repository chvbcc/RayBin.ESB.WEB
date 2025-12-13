<script setup lang="ts">
import { shallowRef, defineProps } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
const editor = shallowRef(VueMonacoEditor)

// 定义属性
interface Props {
  Language: string;
}

// 定义事件
const props = defineProps<Props>();

// 编辑器内容
const code = defineModel<string>('model', { default: '' });

// 编辑器选项
const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  theme: "vs",
}

function handleEditorMount(editorInstance: any) {
  editor.value = editorInstance;
}

</script>
<template>
  <div class="code">
    <vue-monaco-editor v-model:value="code" theme="vs" :options="MONACO_EDITOR_OPTIONS" class="editor" :language="props.Language" @mount="handleEditorMount" />
  </div>
</template>
<style scoped>
  .code { width:100%; height: 500px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; margin-top: 10px;}
  .code .editor { width:100%; height: 500px; }
</style>
