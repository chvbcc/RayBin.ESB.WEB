
<script lang="ts" setup>
import { ref, type ComponentPublicInstance } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import type { TreeProps } from 'ant-design-vue';

// Define props for the component
const props = defineProps<{
  node?: any; // X6 Node instance passed by x6-vue-shape
  graph?: any; // X6 Graph instance passed by x6-vue-shape
}>();

const expandedKeys = ref<string[]>(['0-0-0']);
const selectedKeys = ref<string[]>([]);

// 控制提示显示
const hoverKey = ref<string | null>(null);
const showConnectorHint = ref(false);

const onItemMouseEnter = (key: string) => {
  hoverKey.value = key;
};
const onItemMouseLeave = () => {
  hoverKey.value = null;
};

// 模拟树数据
const treeData: TreeProps['treeData'] = [
  {
    title: 'Parent 1',
    key: '0-0',
    children: [
      {
        title: 'Parent 1-0',
        key: '0-0-0',
        children: [
          { title: 'Leaf A', key: '0-0-0-0' },
          { title: 'Leaf B', key: '0-0-0-1' },
        ],
      },
      { title: 'Leaf C', key: '0-0-1' },
    ],
  },
  {
    title: 'Leaf D',
    key: '0-1',
  },
];

// 存储 Tree Item 的 DOM 引用
const itemRefs = ref<Record<string, HTMLElement | null>>({});
const setItemRef = (el: Element | ComponentPublicInstance | null, key: string) => {
  if (el && typeof el === 'object' && 'querySelector' in el) {
    itemRefs.value[key] = el as HTMLElement;
  } else if (el instanceof HTMLElement) {
    itemRefs.value[key] = el;
  }
};

// 处理单个 Tree Item 的拖拽开始
const onItemDragStart = (e: DragEvent, itemData: { key: string; title: string; isLeaf?: boolean }) => {
  console.log('Tree Item Drag Start:', itemData);
  e.stopPropagation(); // 阻止事件冒泡到 Tree 或更高层

  if (!props.graph || !props.node) {
    console.error("Graph or Node not available in TreeShape component");
    return;
  }

  // 设置拖拽效果和数据
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'copy'; // 或 'move'，取决于你想做什么
    // 将相关信息存入 dataTransfer，供 drop 时使用
    e.dataTransfer.setData('application/x-x6-tree-item-key', itemData.key);
    e.dataTransfer.setData('application/x-x6-tree-item-title', itemData.title);
    e.dataTransfer.setData('application/x-x6-source-node-id', props.node.id); // 来源节点ID

    // （可选但推荐）设置拖拽图像为该 item 本身或其截图
    const itemEl = itemRefs.value[itemData.key];
    if (itemEl && e.dataTransfer.setDragImage) {
        // 微调偏移量使其看起来更自然
        e.dataTransfer.setDragImage(itemEl, e.offsetX, e.offsetY);
    }
  }

  // 通知 X6 开始了一个从这个自定义节点内部发起的拖拽
  props.graph.trigger('node:tree-item-drag-start', {
    node: props.node,
    event: e,
    itemData,
    sourceNode: props.node
  });
};

// 可能需要的其他 Tree 事件处理
const handleTreeItemDragStart = () => {
  // Ant Design Tree 不直接在根节点派发 dragstart，但在 item 上处理了
};
const onMouseDown = (e: MouseEvent) => {
  // 可用于自定义逻辑，例如判断是否点击了特定区域来启动拖拽
};

// （可选）当节点添加到画布后，可能需要执行一些初始化
// 这通常通过 X6 的 events 或者组件的 mounted 钩子处理
</script>
<template>
  <div class="tree-node-wrapper" style="padding: 8px; background-color: #f5f5f5; border-radius: 4px; width: 100%; height: 100%; min-height: 200px; overflow: auto;">
    <div v-if="!graph || !node" style="color: red; padding: 5px;">
      Component not properly initialized
    </div>
    <a-tree v-else :expanded-keys="expandedKeys" :selected-keys="selectedKeys" show-line :tree-data="treeData" @dragstart="handleTreeItemDragStart" @mousedown="onMouseDown">
      <template #title="{ title, key, isLeaf }">
        <!-- 关键部分：使 Tree Item 可拖拽以发起连线 -->
        <span :ref="(el) => setItemRef(el, key)" :data-tree-item-key="key" :data-tree-item-title="title" :data-tree-item-is-leaf="isLeaf" draggable="true" style="cursor: grab; user-select: none;"
          @dragstart="onItemDragStart($event, { key, title, isLeaf })"  @mouseenter="onItemMouseEnter(key)" @mouseleave="onItemMouseLeave()">
          {{ title }}
          <!-- 可选：添加一个小图标表示可以拖拽连线 -->
          <small v-if="showConnectorHint && hoverKey === key" style="color: blue;"> ➤</small>
        </span>
      </template>
      <template #switcherIcon="{ switcherCls }"><down-outlined :class="switcherCls" /></template>
    </a-tree>
  </div>
</template>
<style scoped>
  .tree-node-wrapper { min-width: 200px; min-height: 500px;}
</style>
