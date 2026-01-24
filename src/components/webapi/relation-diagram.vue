<template>
    <div ref="graphContainer" class="x6-graph" @contextmenu.prevent ></div>
    <div id="context-menu" class="context-menu" v-show="contextMenu.visible" :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
      <div @click="handleMenuClick('AutoKey')">{{$t('page.webApi.shortcutMenu.autoKey')}}</div>
      <div @click="handleMenuClick('OutKey')">{{$t('page.webApi.shortcutMenu.outKey')}}</div>
      <div @click="handleMenuClick('SearchKey')">{{$t('page.webApi.shortcutMenu.searchKey')}}</div>
      <div @click="handleMenuClick('DeleteAllKey')">{{$t('page.webApi.shortcutMenu.deleteAllKey')}}</div>
      <div @click="handleMenuClick('DeleteAutoKey')">{{$t('page.webApi.shortcutMenu.deleteAutoKey')}}</div>
      <div @click="handleMenuClick('DeleteOutKey')">{{$t('page.webApi.shortcutMenu.deleteOutKey')}}</div>
      <div @click="handleMenuClick('DeleteSearchKey')">{{$t('page.webApi.shortcutMenu.deleteSearchKey')}}</div>
      <div @click="handleMenuClick('DeleteTable')">{{$t('page.webApi.shortcutMenu.deleteTable')}}</div>
    </div>
</template>

<script setup lang="ts">
  import { Graph, Cell, Shape, Node } from '@antv/x6'
  import { autoLayoutGraph } from '@/utils/dagreLayout';
  import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'

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

          // 获取源节点 类型检查
          const sourceNode = graphInstance.getCellById(sourceNodeId);
          if (!sourceNode || !sourceNode.isNode()) return false;

          // 获取目标节点
          const targetNode = graphInstance.getCellById(targetNodeId);
          if (!targetNode || !targetNode.isNode()) return false;

          // 规则2：只有Table 与 StoredProcedure 才能被连接
          // 获取自定义属性 dataObjectType
          const targetDataObjectType = targetNode.getData()?.dataObjectType ?? targetNode.data?.dataObjectType ?? (targetNode as any).dataObjectType;

          // 只允许连接到 dataObjectType === 'table' 的节点
          if (targetDataObjectType === 'view') return false;

          // 规则3：data下有个 nodeType == api 的节点不能相互连接
          if (sourceNode.getData()?.nodeType === 'api' && targetNode.getData()?.nodeType === 'api') return false;

          // 规则4：禁止目标节点被同一个源多次连接
          // 检查是否已存在：同一个源节点 → 同一个目标节点的同一个目标端口
          const exists = graphInstance.getEdges().some(edge => {
            return (edge.getSourceCellId() === sourceNodeId &&  edge.getTargetCellId() === targetNodeId && edge.getTargetPortId() === targetPort);
          });
          if (exists) { return false; }

          // 规则5: target 节点中只有 keyType === '2' 发的端口可以发起连接
          const sourcePortInfo = sourceNode.getPort(sourcePort);
          const sourceWasTarget = graphInstance.getEdges().some(edge => edge.getTargetCellId() === sourceNodeId);
          if (sourceWasTarget && sourcePortInfo?.keyType === 0 || sourcePortInfo?.keyType === 1 || sourcePortInfo?.keyType === 4 || sourcePortInfo?.keyType === 5) return false;
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
      if (!node) return;
      if (node.getData()?.nodeType === 'api') return;
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

    enum KeyTypeEnum {
      NONE = 0,        // 无选中
      AutoKey = 1,     // 001
      OutKey = 2,      // 010
      AutoOut = 3,     // 011 (1|2)
      SearchKey = 4,   // 100
      AutoSearch = 5,  // 101 (1|4)
      OutSearch = 6,   // 110 (2|4)
      All = 7          // 111 (1|2|4)
    }

    // 第二步：定义样式映射表，为7种组合配置专属样式
    const keyTypeStyleMap: Record<KeyTypeEnum, { fill: string, fontWeight: 'normal' | 'bold' }> = {
      [KeyTypeEnum.NONE]: { fill: '#000', fontWeight: 'normal' },
      [KeyTypeEnum.AutoKey]: { fill: 'black', fontWeight: 'bold' },
      [KeyTypeEnum.OutKey]: { fill: 'red', fontWeight: 'bold' },
      [KeyTypeEnum.SearchKey]: { fill: 'blue', fontWeight: 'bold' },
      [KeyTypeEnum.AutoOut]: { fill: 'orange', fontWeight: 'bold' },
      [KeyTypeEnum.AutoSearch]: { fill: 'purple', fontWeight: 'bold' },
      [KeyTypeEnum.OutSearch]: { fill: 'green', fontWeight: 'bold' },
      [KeyTypeEnum.All]: { fill: 'darkred', fontWeight: 'bold' }
    };
    // 获取当前 端口 keyType
    let currentKeyType: number = node.getPortProp(portId, 'keyType')  || KeyTypeEnum.NONE;
    // 定义样式更新函数，简化重复代码
    const updatePortStyle = (style: { fill: string, fontWeight: 'normal' | 'bold' }) => {
      node.setPortProp(portId, 'attrs/portNameLabel/fontWeight', style.fontWeight);
      node.setPortProp(portId, 'attrs/portNameLabel/fill', style.fill);
      node.setPortProp(portId, 'attrs/portTypeLabel/fontWeight', style.fontWeight);
      node.setPortProp(portId, 'attrs/portTypeLabel/fill', style.fill);
    };
    switch (item) {
      // 叠加 AutoKey（已选中则不处理）
      case 'AutoKey':
        if (!(currentKeyType & KeyTypeEnum.AutoKey)) {
          currentKeyType |= KeyTypeEnum.AutoKey;
          node.setPortProp(portId, 'keyType', currentKeyType);
          updatePortStyle(keyTypeStyleMap[currentKeyType as KeyTypeEnum]);
        }
        break;
      // 叠加 OutKey（已选中则不处理）
      case 'OutKey':
        if (!(currentKeyType & KeyTypeEnum.OutKey)) {
          currentKeyType |= KeyTypeEnum.OutKey;
          node.setPortProp(portId, 'keyType', currentKeyType);
          updatePortStyle(keyTypeStyleMap[currentKeyType as KeyTypeEnum]);
        }
        break;
      // 叠加 SearchKey（已选中则不处理）
      case 'SearchKey':
        if (!(currentKeyType & KeyTypeEnum.SearchKey)) {
          currentKeyType |= KeyTypeEnum.SearchKey;
          node.setPortProp(portId, 'keyType', currentKeyType);
          updatePortStyle(keyTypeStyleMap[currentKeyType as KeyTypeEnum]);
        }
        break;
      // 删除所有Key（清空选中项）
      case 'DeleteAllKey':
        currentKeyType = KeyTypeEnum.NONE;
        node.setPortProp(portId, 'keyType', currentKeyType);
        updatePortStyle(keyTypeStyleMap[KeyTypeEnum.NONE]);
        break;
      // 删除自增主键（仅移除AutoKey，保留其他选中项）
      case 'DeleteAutoKey':
        currentKeyType &= ~KeyTypeEnum.AutoKey;
        node.setPortProp(portId, 'keyType', currentKeyType);
        updatePortStyle(keyTypeStyleMap[currentKeyType as KeyTypeEnum]);
        break;
      // 删除 OutKey（仅移除 OutKey，保留其他选中项）
      case 'DeleteOutKey':
        currentKeyType &= ~KeyTypeEnum.OutKey;
        node.setPortProp(portId, 'keyType', currentKeyType);
        updatePortStyle(keyTypeStyleMap[currentKeyType as KeyTypeEnum]);
        break;
      // 删除 SearchKey（仅移除 SearchKey，保留其他选中项）
      case 'DeleteSearchKey':
        currentKeyType &= ~KeyTypeEnum.SearchKey;
        node.setPortProp(portId, 'keyType', currentKeyType);
        updatePortStyle(keyTypeStyleMap[currentKeyType as KeyTypeEnum]);
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
    if (!data || !graph.value) return;
    const cells: Cell[] = [];
    data.cells.forEach((item: any) => {
      cells.push(item.shape === 'edge' ? graph.value!.createEdge(item) : graph.value!.createNode(item));
    });
    graph.value?.resetCells(cells);
    const nodes = cells.filter(cell => cell.isNode()) as Node[];
    nodes.forEach(node => {
      autoLayoutGraph(graph, node);
    });
    emit('dataLoaded', data);
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

  // #region 清空所有节点和连线
  function clearNodes() {
    if (!graph.value) return;
    graph.value?.clearCells();
  }
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

  function addEdges (edges: any[])  {
    // 实现添加边的逻辑
    if (graph.value) {
      edges.forEach(edge => {
        graph.value?.addEdge(edge);
      });
    }
  }

  // #region 暴露公共方法给父组件
  const exposeMethods = {
    getData,
    getDataObjectNames,
    setData,
    addDataObjects,
    clearNodes,
    deleteDataObjects,
    validateUnusedNodes,
    addEdges
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
