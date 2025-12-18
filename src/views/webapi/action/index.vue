<!-- App.vue -->
<template>
  <div style="height: 100vh; display: flex; flex-direction: column;">
    <div ref="container" style="flex: 1; border: 1px solid #ccc;"></div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineComponent } from 'vue';
import { Graph } from '@antv/x6'
import { register, getTeleport } from '@antv/x6-vue-shape';
//const TeleportContainer = defineComponent(getTeleport());
import TreeShape from './TreeShape.vue'; // 导入上面创建的组件

const container = ref<HTMLDivElement | null>(null);
let graph: Graph | null = null;

onMounted(() => {
  if (!container.value) return;

  // 1. 注册 Vue Shape
  register({
    shape: 'custom-vue-node',
    width: 200,
    component: TreeShape //定义的vue组件
  });

    // 2. 初始化画布
  graph = new Graph({
    container: container.value,
    width: 1000,
    height: 800,
    grid: true,
    mousewheel: { enabled: true, zoomAtMousePosition: true },
    connecting: {
      router: 'manhattan',
      connector: { name: 'rounded', args: { radius: 8 } },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      highlight: true,
      snap: true,
      // 验证连接 - 允许从 tree-node 连出，连接到其他任何节点
      validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet }) {
        // 只要起点是 tree-node 或其内部元素（magnet），就可以连接
        return !!sourceMagnet; // 更严格的检查可以检查 sourceView.cell shape
      },
      createEdge() {
        return graph?.createEdge({
          attrs: {
            line: {
              stroke: '#5F95FF',
              strokeWidth: 2,
              targetMarker: { name: 'classic' }
            }
          },
          zIndex: -1
        });
      }
    },
    highlighting: {
      magnetAdsorbed: { name: 'stroke', args: { attrs: { fill: '#5F95FF', stroke: '#5F95FF' } } }
    },
    interacting: {
       edgeLabelMovable: false, // 禁止移动边标签
       nodeMovable: true, // 允许移动节点
       magnetConnectable: true // 允许通过磁力桩连接
    }
  });

  // 3. 添加 Tree 节点到画布
  graph.addNode({
    shape: 'custom-vue-node',
    x: 50,
    y: 50,
    width: 200,  // Explicitly set width
  });

  // 4. 添加另一个普通节点用于测试连接
  graph.addNode({
     shape: 'rect',
     x: 400,
     y: 200,
     width: 100,
     height: 40,
     label: 'Target Node',
     ports: [{ group: 'top' }, { group: 'bottom' }]
  });
});

</script>

<style>
/* 确保 X6 容器有明确的高度 */
html, body, #app { height: 100%; margin: 0; }
</style>
