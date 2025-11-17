// 将JSON数据转换为Api.SystemManage.MenuTree[]类型
import type { DataNode } from 'ant-design-vue/es/tree';
export function convertToMenuTree(data: any[]): Api.SystemManage.MenuTree[] {
  return data.map(item => {
    return {
      id: item.id,
      label: item.title, // 将title转换为label
      parentId: item.parentID, // 将parentID转换为parentId
      children: item.children && item.children.length > 0
        ? convertToMenuTree(item.children)
        : undefined
    };
  });
}

// 完整的转换流程：先转换为MenuTree，再转换为DataNode
export function fullTransformToDataNode(jsonData: any): DataNode[] {
  const menuTree = convertToMenuTree(jsonData.data);
  return recursiveTransform(menuTree);
}

// 已有的recursiveTransform函数，将MenuTree转换为DataNode
export function recursiveTransform(data: Api.SystemManage.MenuTree[]): DataNode[] {
  return data.map(item => {
    const { id: key, label } = item;

    if (item.children) {
      return {
        key,
        title: label,
        children: recursiveTransform(item.children)
      };
    }

    return {
      key,
      title: label
    };
  });
}
