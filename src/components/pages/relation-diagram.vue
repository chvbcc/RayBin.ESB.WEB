<template>
  <div class="main">
    <div ref="graphContainer" class="er-box" @contextmenu.prevent></div>
    <div id="context-menu" class="context-menu" v-show="contextMenu.visible" :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
      <div @click="handleMenuClick('Key')">主键</div>
      <div @click="handleMenuClick('OutKey')">输出主键</div>
      <div @click="handleMenuClick('DeleteKey')">删除主键</div>
      <div @click="handleMenuClick('DeleteTable')">删除表视图</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref, defineProps, defineEmits, watch } from 'vue'
  import { Graph, Cell, Shape } from '@antv/x6'

  // 图实例
  const graph = ref<Graph>();
  const graphContainer = ref<HTMLDivElement>();

  // 右键菜单状态
  const contextMenu = ref({ visible: false, x: 0, y: 0, node: null as Cell | null, portId: null as string | null })

  // #region 组件属性
  const props = defineProps({
    // 可以传入自定义的配置选项
    config: { type: Object, default: () => ({}) },
    dataSource: { type: Array, default: () => [] }
  })
  // #endregion

  // #region 组件事件
  const emit = defineEmits([
    'init',       // 初始化完成事件
    'dataLoaded', // 数据加载完成事件
  ])
  // #endregion

  // #region 注册端口布局
  Graph.registerPortLayout('erPortPosition',(portsPositionArgs) => {
      return portsPositionArgs.map((_, index) => {
        return {
          position: { x: 0, y: (index + 1) * 28 }
        }
      })
    },
    // 存在同名端口布局，则覆盖它
    true,
  )
  // #endregion

  // #region 注册节点
  Graph.registerNode('er-rect',
    {
      inherit: 'rect',
      markup: [
        { tagName: 'rect', selector: 'body' },
        { tagName: 'text', selector: 'label' },
      ],
      attrs: {
        rect: { strokeWidth: 1, stroke: '#112338', fill: '#324a63' },
        label: { fontWeight: 'bold', fill: '#ffffff', fontSize: 12 },
      },
      ports: {
        groups: {
          list: {
            markup: [
              { tagName: 'rect', selector: 'portBody' },
              { tagName: 'text', selector: 'portNameLabel' },
              { tagName: 'text', selector: 'portTypeLabel' },
            ],
            attrs: {
              portBody: { strokeWidth: 1, stroke: '#7F8C8D', fill: '#ECF0F1', magnet: true },
              portNameLabel: { ref: 'portBody', refX: 6,  refY: 10, fontSize: 11, fill: '#333333' },
              portTypeLabel: { ref: 'portBody', refX: 95, refY: 10, fontSize: 11, fill: '#333333' },
            },
            position: 'erPortPosition',
          },
        },
      },
    },
    true,
  )
  // #endregion

  // #region 初始化ER图
  function initGraph() {
    if (!graphContainer.value) return;
    // 合并用户配置和默认配置
    const defaultConfig = {
      container: graphContainer.value,
      connecting: {
        allowBlank: false, // 不允许连接到空白位置
        allowLoop: false,  // 不允许自连接
        router: {
          name: 'er',
          args: { offset: 26, direction: 'H' },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {stroke: '#A2B1C3', strokeWidth: 2 },
            },
          })
        },
        validateConnection(args: any) {
          const { sourcePort, targetPort } = args;
          // 规则1：必须连接端口
          if (!sourcePort || !targetPort) return false;
          return true;
        },
      }
    };

    const mergedConfig = { ...defaultConfig, ...props.config };

    graph.value = new Graph(mergedConfig);

    // 监听悬停事件
    graph.value.on('edge:mouseenter', (args) => {
      const { edge } = args;
      edge.attr('line/stroke', '#1890FF');
      edge.attr('line/strokeWidth', 2);
    });

    graph.value.on('edge:mouseleave', (args) => {
      const { edge } = args;
      edge.attr('line/stroke', '#A2B1C3');
      edge.attr('line/strokeWidth', 2);
    });

    // 双击删除连线
    graph.value.on('edge:dblclick', (edge: any) => {
      graph.value?.removeEdge(edge.cell.id);
    });

    // 双击节点头部 → 删除节点 + 所有关联连线
    graph.value.on('node:dblclick', (args) => {
      const { node } = args;
      const edges = graph.value?.getEdges();
      const connectedEdges = edges?.filter(edge => {
        return edge.getSourceCellId() === node.id || edge.getTargetCellId() === node.id;
      });
      connectedEdges?.forEach(edge => graph.value?.removeEdge(edge));
      graph.value?.removeNode(node);
    });

    // 节点右键菜单
    graph.value.on('node:contextmenu', ({ e, node }) => {
      let target = e.target.parentElement;
      if (target.nodeName === 'text') target = target.parentElement || null;
      if (target.nodeName ==='g') {
        e.preventDefault();
        // 获取鼠标位置（相对于画布容器）
        const containerRect = graph.value!.container.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;
        showNodeContextMenu(x, y, node, target.getAttribute('port') || '');
      }
    });

    // 触发初始化完成事件
    emit('init', graph.value);
  }
  // #endregion

  // #region 显示菜单
  function showNodeContextMenu(x: number, y: number, node: Cell, id: string) {
    contextMenu.value.visible = true;
    contextMenu.value.x = x;
    contextMenu.value.y = y;
    contextMenu.value.node = node;
    contextMenu.value.portId = id;
  }
  // #endregion

  // #region 处理菜单点击
  function handleMenuClick(item: string) {
    const { node, portId } = contextMenu.value;
    if (!node || !portId || !graph.value) return;
    if (!node.isNode()) return;

    switch (item) {
      case 'Key':
        node.setPortProp(portId, 'keyType', '1');
        node.setPortProp(portId, 'attrs/portNameLabel/fontWeight', 'bold');
        node.setPortProp(portId, 'attrs/portNameLabel/fill', 'black');
        node.setPortProp(portId, 'attrs/portTypeLabel/fontWeight', 'bold');
        node.setPortProp(portId, 'attrs/portTypeLabel/fill', 'black');
        break;
      case 'OutKey':
        node.setPortProp(portId, 'keyType', '2');
        node.setPortProp(portId, 'attrs/portNameLabel/fontWeight', 'bold');
        node.setPortProp(portId, 'attrs/portNameLabel/fill', 'red');
        node.setPortProp(portId, 'attrs/portTypeLabel/fontWeight', 'bold');
        node.setPortProp(portId, 'attrs/portTypeLabel/fill', 'red');
        break;
      case 'DeleteKey':
        node.setPortProp(portId, 'keyType', '0');
        node.setPortProp(portId, 'attrs/portNameLabel/fontWeight', 'normal');
        node.setPortProp(portId, 'attrs/portNameLabel/fill', '#000');
        node.setPortProp(portId, 'attrs/portTypeLabel/fontWeight', 'normal');
        node.setPortProp(portId, 'attrs/portTypeLabel/fill', '#000');
        break;
    }
    hideContextMenu();
  }
  // #endregion

  // #region 隐藏菜单
  function hideContextMenu() {
    contextMenu.value.visible = false;
    contextMenu.value.node = null;
    contextMenu.value.portId = null;
  }
  // #endregion

  // #region 获取数据
  function getData() {
    if (!graph.value) return null;
    const data = graph.value.toJSON() as string | any;
    return data;
  }
  // #endregion

  // #region 设置数据
  function setData(data?: any[]) {
    if (data) {
      if (!graph.value) return;
      const cells: Cell[] = [];
      data.forEach((item: any) => {
        if (item.shape === 'edge') {
          cells.push(graph.value!.createEdge(item))
        } else {
          cells.push(graph.value!.createNode(item))
        }
      });
      graph.value?.resetCells(cells);
      graph.value?.zoomToFit({ padding: 10, maxScale: 1 });
      emit('dataLoaded', data);
    }
  }
  // #endregion

  // #region 获取已添加的数据对象名称列表
  function getDataObjectNames(): string[] {
    const  jsonData = getData();
    if (!jsonData.cells || !Array.isArray(jsonData.cells)) {
      return [];
    }
    const dataObjectNames = jsonData.cells.map((cell: any) => cell.attrs?.text?.text).filter((text: any) => typeof text === 'string');
    return dataObjectNames;
  }
  // #endregion

  // #region 监控数据
  watch(() => props.dataSource,
    (newData) => {
      if (newData && newData.length > 0) {
        setData(newData); // 调用 setData 方法加载数据
      }
    },
    { immediate: true } // 立即执行一次以加载初始数据
  );
  // #endregion

  // #region 添加表节点
  function addTable() {
    if (!graph.value) return;
    // 创建一个表节点
    const tableNode = graph.value.createNode({
      // shape: 'er-rect', // 使用自定义的表节点形状
      // x: 100, // 节点的初始 x 坐标
      // y: 100, // 节点的初始 y 坐标
      // width: NODE_WIDTH, // 节点宽度
      // height: 24, // 节点高度
      // connectionId: 1, // 节点的唯一标识符
      // "visible": true,
      // attrs: {
      //   text: {
      //     text: '新表', // 节点的标签
      //   },
      // },
      // ports: {
      //   items: [
      //     { id: 'port1', group: 'list', attrs: { portNameLabel: { text: '字段1' }, portTypeLabel: { text: 'int' } } },
      //     { id: 'port2', group: 'list', attrs: { portNameLabel: { text: '字段2' }, portTypeLabel: { text: 'varchar' } } },
      //   ],
      // },
    });
    // 将节点添加到图中
    graph.value.addNode(tableNode);
  }
  //#endregion

  // #region 组件挂载和卸载
  onMounted(() => {
    initGraph();
    document.addEventListener('click', hideContextMenu);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', hideContextMenu);
    if (graph.value) {
      graph.value.dispose();
      graph.value = undefined;
    }
  });
  // #endregion

  // #region 暴露公共方法给父组件
  const exposeMethods = {
    getData,
    getDataObjectNames,
    setData,
    addTable
  };

  // 暴露方法
  defineExpose(exposeMethods);
  // #endregion
</script>

<style scoped>
  .main         { width: 100%; border: #ECF0F1 1px solid; margin: 0px; background-color: #fCfCfC;}
  .er-box       { width: 100%; height: 50vh; }
  .context-menu { position: absolute;  background: white; border: 1px solid #ddd; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; border-radius: 4px; text-align: left; }
  .context-menu > div { padding: 6px 12px; cursor: pointer; font-size: 12px; }
  .context-menu > div:hover { background: #f0f0f0; }
</style>
