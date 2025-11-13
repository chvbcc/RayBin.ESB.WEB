import { request } from '../request';

/** get task log list */
export function fetchGetPagingList(params?: Api.Log.TaskLogSearchParams) {
  return request<Api.Log.TaskLogList>({
    url: '/tasklog/getPagingList',
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
export function fetchDelete(ids: number[]) {
  return request({
    url: '/tasklog/delete',
    method: 'delete',
    data: ids,
  });
}
