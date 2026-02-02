import { request } from '../request';

/** get task log list */
export function fetchGetPagingList(params?: Api.Log.SearchParams) {
  return request<Api.Log.TaskLogList>({
    url: '/tasklog/getPagingList',
    method: 'get',
    params
  });
}

export function fetchGetHomeList() {
  return request<Api.Log.TaskLog[]>({
    url: '/tasklog/getHomeList',
    method: 'get',
  });
}


export function getTaskSpentTime() {
  return request({
    url: '/tasklog/getTaskSpentTime',
    method: 'get'
  });
}
export function fetchGetModel(id: number) {
  return request({
    url: '/tasklog/getModel',
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
export function fetchDeletes(ids: number[]) {
  return request({
    url: '/tasklog/delete',
    method: 'delete',
    data: ids,
  });
}
