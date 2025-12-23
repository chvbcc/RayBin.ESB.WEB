<template>
    <div ref="graphContainer" class="x6-graph" @contextmenu.prevent ></div>
    <div id="context-menu" class="context-menu" v-show="contextMenu.visible" :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
      <div @click="handleMenuClick('Key')">主键</div>
      <div @click="handleMenuClick('OutKey')">输出主键</div>
      <div @click="handleMenuClick('DeleteKey')">删除主键</div>
      <div @click="handleMenuClick('DeleteTable')">删除表视图</div>
    </div>
</template>

<script setup lang="ts">
  import { Graph, Cell, Shape, Node } from '@antv/x6'
  import { autoLayoutGraph } from '@/utils/dagreLayout';
  import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'


  // #region 1. 参数定义
  // 图实例
  const graph = ref<Graph>();
  const graphContainer = ref<HTMLDivElement>();

  // 右键菜单状态
  const contextMenu = ref({ visible: false, x: 0, y: 0, node: null as Cell | null, portId: null as string | null })
  // #endregion

  // #region 2. 组件属性
  const props = defineProps({
    // 可以传入自定义的配置选项
    config: { type: Object, default: () => ({}) },
    dataSource: { type: Array, default: () => [] }
  })
  // #endregion

  // #region 3. 组件事件
  const emit = defineEmits([
    'init',       // 初始化完成事件
    'dataLoaded', // 数据加载完成事件
  ])
  // #endregion

  // #region 4. 注册端口布局
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

  // #region 5. 注册节点
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
              portNameLabel: { ref: 'portBody', refX: 8,  refY: 10, fontSize: 11, fill: '#333333', magnet: true },
              portTypeLabel: { ref: 'portBody', refY: 10, fontSize: 11, fill: '#333333', magnet: true },
            },
            position: 'erPortPosition',
          },
        },
      },
    },
    true,
  )
  // #endregion

  // #region 6. 初始化ER图
  function initGraph() {
    if (!graphContainer.value) return;
    // 合并用户配置和默认配置
    const defaultConfig = {
      container: graphContainer.value,
      panning: true,
      scroller: { enabled: true, pannable: true },
      connecting: {
        allowBlank: false, // 不允许连接到空白位置
        allowLoop: false,  // 不允许自连接
        router: { name: 'er', args: { offset: 26, direction: 'H' } },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {stroke: '#A2B1C3', strokeWidth: 2 },
            },
          })
        },
        validateConnection(args: any) {
          const { sourceView, targetView, sourcePort, targetPort } = args;
          // 规则1：必须连接端口
          if (!sourcePort || !targetPort) return false;

          // 获取 graph 实例
          const graphInstance = graph.value;
          if (!graphInstance) return false;

          // 源与目标节点 ID
          const sourceNodeId = sourceView.cell.id;
          const targetNodeId = targetView.cell.id;
          if (!targetNodeId) return false;

          // 获取目标节点
          const targetNode = graphInstance.getCellById(targetNodeId);
          if (!targetNode) return false;

          // 规则2：只有Table 与 StoredProcedure 才能被连接
          // 获取自定义属性 dataObjectType
          const targetDataObjectType = targetNode.getData()?.dataObjectType ?? targetNode.data?.dataObjectType ?? (targetNode as any).dataObjectType;

          // 只允许连接到 dataObjectType === 'table' 的节点
          if (targetDataObjectType === 'view') return false;

          // 规则3：禁止目标节点被同一个源多次连接

          // 检查是否已存在：同一个源节点 → 同一个目标节点的同一个目标端口
          const exists = graphInstance.getEdges().some(edge => {
            return (
              edge.getSourceCellId() === sourceNodeId &&
              edge.getTargetCellId() === targetNodeId &&
              edge.getTargetPortId() === targetPort
            );
          });

          if (exists) { return false; }

          // 新规则：要么 source 连 target，要么 target 连 source；target 不可再向其它节点发起连接
          const sourceWasTarget = graphInstance.getEdges().some(edge => edge.getTargetCellId() === sourceNodeId);
          if (sourceWasTarget) { return false; }

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

    // 节点拖拽事件前设置显示层级
    graph.value.on('node:move', ({ node }: { node: any }) => {
      node.setZIndex(10);
    });

    // 节点拖拽事件后重置显示层级
    graph.value.on('node:moved', ({ node }: { node: any }) => {
      node.setZIndex(1);
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

  function setData(data?: { cells: any[] }) {
    if (data && graph.value) {
      const cells: Cell[] = [];
      data.cells.forEach((item: any) => {
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

  // #region 画布大小处理函数
  function handleResize() {
    if (graph.value) {
      graph.value.resize(); // 关键：通知 X6 重新计算尺寸
    }
  }
  // #endregion

  // #region 监控数据
  watch(() => props.dataSource,
    newData => {
      if (!newData || newData.length === 0) return;
      // 若图尚未初始化，延后到下一个 tick
      if (!graph.value) {
        nextTick(() => { if (graph.value) setData({ cells: newData as any[] }); });
        return;
      }
      setData({ cells: newData as any[] });
    },
    { immediate: true, flush: 'post' } // 等待子组件挂载后再执行首次回调
  );
  // #endregion

  // #region 添加表节点
  function addDataObjects(dataObjectNodes: Api.Task.DataObjectNode[]) {
    if (!graph.value || !dataObjectNodes) return;
    dataObjectNodes.forEach(dataObjectNode => {
      // 创建 tableNode
        const tableNode: Node = graph.value!.createNode({
        id: dataObjectNode.id,
        shape: dataObjectNode.shape,
        width: dataObjectNode.width,
        height: dataObjectNode.height,
        x: dataObjectNode.x,
        y: dataObjectNode.y,
        zIndex: 1,
        data: dataObjectNode.data,
        attrs: dataObjectNode.attrs,
        ports: dataObjectNode.ports
      });
      // 将节点添加到图中
      graph.value!.addNode(tableNode);
      // 居中显示新添加的节点
      nextTick(() => {
        autoLayoutGraph(graph, tableNode);
      });
    });
  }
  //#endregion

  // #region 组件挂载和卸载
  onMounted(() => {
    initGraph();
    document.addEventListener('click', hideContextMenu);
    window.addEventListener('resize', handleResize);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', hideContextMenu);
    window.removeEventListener('resize', handleResize);
    if (graph.value) {
      graph.value.dispose();
      graph.value = undefined;
    }
  });
  // #endregion

  // #region 根据label名称删除多个节点
  function deleteDataObjects(nodeNames: string[], dataObjectType: Api.Task.DataObjectType): boolean {
    if (!graph.value || !nodeNames || nodeNames.length === 0) return false;

    // 获取所有节点
    const nodes = graph.value.getNodes();
    let deleted = false;

    // 查找并删除匹配标签的节点
    nodes.forEach(node => {
      const nodeLabel = node.attr('text/text') as string;
      // 检查节点标签是否在提供的名称数组中
      if (nodeNames.includes(nodeLabel) && node.getData().dataObjectType === dataObjectType) {
        // 获取与该节点相关的所有边
        const edges = graph.value!.getEdges();
        const connectedEdges = edges.filter(edge => {
          return edge.getSourceCellId() === node.id || edge.getTargetCellId() === node.id;
        });
        // 删除相关的边
        connectedEdges.forEach(edge => graph.value?.removeEdge(edge));
        // 删除节点
        graph.value?.removeNode(node);
        deleted = true;
      }
    });
    return deleted;
  }
  // #endregion

  //#region 验证是否存在未使用的节点
  function validateUnusedNodes() {
    if (!graph.value) return true;
    const nodes = graph.value.getNodes();
    const edges = graph.value.getEdges();
    if (nodes.length === 0 || edges.length === 0) {
      return true;
    }
    return false;
  }
  //#endregion

  // #region 暴露公共方法给父组件
  const exposeMethods = {
    getData,
    getDataObjectNames,
    setData,
    addDataObjects,
    deleteDataObjects,
    validateUnusedNodes
  };

  // 暴露方法
  defineExpose(exposeMethods);
  // #endregion
</script>

<style scoped>
  .x6-graph { width:100% !important; height: 100% !important; }
  .context-menu { position: absolute;  background: white; border: 1px solid #ddd; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; border-radius: 4px; text-align: left; }
  .context-menu > div { padding: 6px 12px; cursor: pointer; font-size: 12px; }
  .context-menu > div:hover { background: #f0f0f0; }
</style>
