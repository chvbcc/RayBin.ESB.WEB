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
