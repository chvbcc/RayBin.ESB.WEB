import { request } from '../request';

/** get connection list */
export function fetchGetConnectionList(params?: Api.ConnectionTypes.ConnectionSearchParams) {
  return request<Api.ConnectionTypes.ConnectionList>({
    url: '/connection/getList',
    method: 'get',
    params
  });
}

/** test connection */
export function testConnection(data: Api.ConnectionTypes.ConnectionModel) {
  return request<App.Service.Response>({
    url: '/connection/testConnection',
    method: 'post',
    data
  })
}
