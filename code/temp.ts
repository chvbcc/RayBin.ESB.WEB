  //Parameters.vue
  // // 获取参数数据 (简化为直接返回model.value)
  // function getParams(): Api.Task.Param[] {
  //   return model.value;
  // }

  // // 设置参数数据
  // function setParams(params: Api.Task.Param[]): void {
  //   if (params && params.length > 0) {
  //     model.value = params.map(param => ({
  //       name: param?.name ?? '',
  //       value: param?.value ?? '',
  //       valueType: param?.valueType ?? 0,
  //       description: param?.description ?? ''
  //     }));
  //   } else if (model.value.length === 0) {
  //     // 只有当内部没有数据时，才添加一个空行
  //     model.value = [createEmptyModel()];
  //   }
  // }

  // defineExpose({ setParams, getParams });

            // // 规则3.2：禁止 target 与 source 形成反向连接
          // const reverseExists = graphInstance.getEdges().some(edge => {
          //   return edge.getSourceCellId() === targetNodeId && edge.getTargetCellId() === sourceNodeId;
          // });
          // if (reverseExists) { return false; }

          // // 规则4：一个 target 只能被同一个 source 节点连接 禁止多对一
          // // 获取所有以 targetNodeId 为 target 的边
          // const incomingEdges = graphInstance.getEdges().filter(edge => { return edge.getTargetCellId() === targetNodeId;});
          // // 如果已经有入边
          // if (incomingEdges.length > 0) {
          //   // 检查是否来自同一个源节点
          //   const existingSourceId = incomingEdges[0].getSourceCellId();
          //   if (existingSourceId !== sourceNodeId) { return false; }
          // }
