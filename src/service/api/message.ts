import { request } from '../request';

/** get task log list */
export function fetchGetPagingList(params?: Api.Message.SearchParams) {
  return request<Api.Task.TaskList>({
    url: '/message/getPagingList',
    method: 'get',
    params
  });
}

export function fetchGetList(taskId?: number) {
  return request<Api.Message.MessageList>({
    url: '/message/getList',
    method: 'get',
    params: { taskId }
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
