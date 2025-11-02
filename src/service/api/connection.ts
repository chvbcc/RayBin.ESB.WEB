import { request } from '../request';

/** test connection */
export function fetchTest(data: Api.Connection.ConnectionModel) {
  return request({
    url: '/connection/testConnection',
    method: 'post',
    data
  })
}

/** get connection options   */
export function fetchGetConnectionOptions() {
  return request<Api.Connection.ConnectionOptions>({
    url: '/connection/getOptions',
    method: 'get'
  });
}

/** get connection list */
export function fetchGetPagingList(params?: Api.Connection.ConnectionSearchParams) {
  return request<Api.Connection.ConnectionList>({
    url: '/connection/getPagingList',
    method: 'get',
    params
  });
}

export function fetchGetModel(id: number) {
  return request({
    url: '/connection/getModel',
    method: 'get',
    params: { id }
  });
}

/** check connection name*/
export function fetchCheckName(connectionName: string, createUserId: number, id: number) {
  return request({
    url: '/connection/checkName',
    method: 'get',
    params: { connectionName, createUserId, id }
  });
}

/** save connection */
export function fetchSave(data: Api.Connection.ConnectionModel) {
  let url = data.id === 0 ? '/connection/add' : '/connection/update';
  return request({
    url: url,
    method: 'post',
    data
  });
}

/** delete connection by id */
export function fetchDelete(id: number) {
  return request({
    url: '/connection/delete',
    method: 'delete',
    params: { id }
  });
}
