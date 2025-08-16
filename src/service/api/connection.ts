import { request } from '../request';

/** get connection list */
export function fetchGetList(params?: Api.ConnectionTypes.ConnectionSearchParams) {
  return request<Api.ConnectionTypes.ConnectionList>({
    url: '/connection/getList',
    method: 'get',
    params
  });
}

/** test connection */
export function fetchTest(data: Api.ConnectionTypes.ConnectionModel) {
  return request({
    url: '/connection/testConnection',
    method: 'post',
    data
  })
}

/** check connection name*/
export function fetchCheckName(connectionName: string, createUserId: number, id: number) {
  return request({url: '/connection/checkName', params: { connectionName, createUserId, id }});
}

/** save connection */
export function fetchSave(data: Api.ConnectionTypes.ConnectionModel) {
  return request({
    url: '/connection/save',
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

export function fetchGetModel(id: number) {
  return request({
    url: '/connection/getModel',
    method: 'get',
    params: { id }
  });
}
