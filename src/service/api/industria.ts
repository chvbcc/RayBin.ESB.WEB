import { request } from '../request';

export function fetchGetPagingList(params?: Api.Industria.IndustriaApiSearchParams) {
  return request<Api.Industria.IndustriaApiList>({
    url: '/industriaapi/getPagingList',
    method: 'get',
    params
  });
}

export function fetchGetConnectionOptions() {
  return request<Api.DeviceConnection.DeviceConnectionOptions>({
    url: '/deviceConnection/getOptions',
    method: 'get'
  });
}

// export function fetchGetList(industriaId: number) {
//   return request({
//     url: '/industriaapi/getList',
//     method: 'get',
//     params: { taskId }
//   });
// }

export function fetchGetModel(id: number) {
  return request({
    url: '/industriaapi/getModel',
    method: 'get',
    params: { id }
  });
}

export function fetchDelete(id: number) {
  return request({
    url: '/industriaapi/delete',
    method: 'delete',
    params: { id }
  });
}

export function fetchCheckName(taskName: string, createUserId: number, id: number) {
  return request({
    url: '/industriaapi/checkName',
    method: 'get',
    params: { taskName, createUserId, id }
  });
}

// 授权测试
export function fetchTest(data: Api.Industria.ApiModel) {
  return request({
    url: '/industriaapi/apiTest',
    method: 'post',
    data
  });
}

export function fetchSave(data: Api.Industria.IndustriaApiModel) {
  if (data.industriaApi.id === 0) {
    return request({
      url: '/industriaapi/add',
      method: 'post',
      data: { ...data }
    });
  } else {
    return request({
      url:  '/industriaapi/update',
      method: 'post',
      data: { ...data }
    });
  }
}

export function fetchBrowse(id: number) {
  return request({
    url: '/opcua/browse',
    method: 'get',
    params: { id }
  });
}

