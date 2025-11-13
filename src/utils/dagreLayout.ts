import { Graph, Node } from '@antv/x6';

// 网格布局算法：从左到右，自动换行
export function autoLayoutGraph(graphRef: { value: Graph | undefined }, node: Node) {
  const graph = graphRef.value;
  if (!node || !graph) return;

  const nodes = graph.getNodes();
  if (!nodes) return;

  const container = graph.container;
  if (!container) return;

  const nodeCount: number = nodes.length;

  // 设置节点间距和边距
  const horizontalSpacing = 50; // 水平间距
  const verticalSpacing = 120;  // 垂直间距
  const margin = 20;

  // 获取容器宽度，用于计算每行能容纳的节点数    // 边距
  const containerWidth = container.clientWidth - margin * 2;

  if (nodeCount - 1 > 0) {
    let totalWidth = 0;
    nodes.forEach((node) => {
      const size = node.size();
      totalWidth += size.width || 150;
    });
    const avgNodeWidth = totalWidth / nodeCount;
    const maxNodesPerRow = Math.max(1, Math.floor((containerWidth + horizontalSpacing) / (avgNodeWidth + horizontalSpacing)));

    // 计算当前节点应该放置的行和列
    const index = nodes.indexOf(node);
    const row = Math.floor(index / maxNodesPerRow);
    const col = index % maxNodesPerRow;

    // 计算节点位置
    const x = margin + col * (avgNodeWidth + horizontalSpacing);
    const y = margin + row * verticalSpacing;

    // 设置节点位置
    graph.batchUpdate(() => {
      node.setPosition(x, y);
    });
  } else {
    // 第一个节点，放在左上角
    const x = margin;
    const y = margin;
    graph.batchUpdate(() => {
      node.setPosition(x, y);
    });
  }
}
