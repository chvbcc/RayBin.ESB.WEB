import { request } from '../request';

/** test connection */
export function fetchTest(data: Api.ConnectionTypes.ConnectionModel) {
  return request({
    url: '/connection/testConnection',
    method: 'post',
    data
  })
}

/** get connection list */
export function fetchGetList(params?: Api.ConnectionTypes.ConnectionSearchParams) {
  return request<Api.ConnectionTypes.ConnectionList>({
    url: '/connection/getList',
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
  return request({url: '/connection/checkName', params: { connectionName, createUserId, id }});
}

/** save connection */
export function fetchSave(data: Api.ConnectionTypes.ConnectionModel) {
  let url = data.id === 0 ? '/connection/save' : '/connection/update';
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


