import { graphlib, layout } from '@dagrejs/dagre';
import { Graph } from '@antv/x6';

function isNodeTerminal(term: any): term is { cell: string } {
  return term != null && typeof term === 'object' && 'cell' in term;
}

interface LayoutOptions {
  rankdir?: 'TB' | 'BT' | 'LR' | 'RL';
  nodesep?: number;
  ranksep?: number;
}

function createDagreLayout(
  nodes: Array<{
    id: string;
    width: number;
    height: number;
    x?: number;
    y?: number;
    isDragged?: boolean;
    visible?: boolean;
  }>,
  edges: Array<{ source: string; target: string }>,
  options: LayoutOptions = {}
) {
  const g = new graphlib.Graph();
  g.setGraph({
    rankdir: options.rankdir || 'TB',
    nodesep: options.nodesep || 60,
    ranksep: options.ranksep || 80,
  });
  g.setDefaultEdgeLabel(() => ({}));

  const layoutNodes = nodes.filter(node => !node.isDragged && node.visible !== false);
  layoutNodes.forEach(node => {
    g.setNode(node.id, { width: node.width, height: node.height });
  });

  edges.forEach(edge => {
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  });

  layout(g);

  return nodes.map(node => {
    if (node.isDragged || node.visible === false) {
      return { id: node.id, x: node.x, y: node.y };
    } else {
      const pos = g.node(node.id);
      return { id: node.id, x: pos.x, y: pos.y };
    }
  });
}

export function autoLayoutGraph(graphRef: { value: Graph | undefined }) {
  const graph = graphRef.value;
  if (!graph) return;

  const nodes = graph.getNodes();
  const edges = graph.getEdges();

  const dagreNodes = nodes.map(node => {
    const data = node.getData();
    return {
      id: node.id,
      width: node.size().width,
      height: node.size().height,
      x: node.position().x,
      y: node.position().y,
      isDragged: data?.isDragged ?? false,
    };
  });

  const dagreEdges = edges
    .map(edge => {
      const source = edge.getSource();
      const target = edge.getTarget();
      if (isNodeTerminal(source) && isNodeTerminal(target)) {
        return { source: source.cell, target: target.cell };
      }
      return null;
    })
    .filter((e): e is { source: string; target: string } => e !== null);

  const newPositions = createDagreLayout(dagreNodes, dagreEdges, {
    rankdir: 'LR', // 从左到右排列
    nodesep: 60,   // 节点水平间距
    ranksep: 80,   // 节点垂直间距
  });

  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  graph.batchUpdate(() => {
    newPositions.forEach(pos => {
      if (pos.x == null || pos.y == null) return;
      const node = nodeMap.get(pos.id);
      if (node && !node.getData()?.isDragged) {
        node.setPosition(pos.x, pos.y);
      }
    });
  });

  graph.centerContent();
}
