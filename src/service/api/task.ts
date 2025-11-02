import { request } from '../request';

/** get task list */
export function fetchGetPagingList(params?: Api.Task.TaskSearchParams) {
  return request<Api.Task.TaskList>({
    url: '/taskdatabase/getPagingList',
    method: 'get',
    params
  });
}

/** delete task by id */
export function fetchDelete(id: number) {
  return request({
    url: '/taskdatabase/delete',
    method: 'delete',
    params: { id }
  });
}
