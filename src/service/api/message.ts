import { request } from '../request';

/** get task log list */
export function fetchGetTaskPagingList(params?: Api.Message.TaskSearchParams) {
  return request<Api.Task.TaskList>({
    url: '/message/getTaskPagingList',
    method: 'get',
    params
  });
}

export function getAssignedUserPagingList(params?: Api.Message.UserSearchParams) {
  return request({
    url: '/message/getAssignedUserPagingList',
    method: 'get',
    params
  });
}

export function fetchGetAssignedUserList(taskId?: number) {
  return request<Api.Message.MessageList>({
    url: '/message/getAssignedUserList',
    method: 'get',
    params: { taskId }
  });
}

export function fetchGetUserPagingList(params?: Api.Message.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/message/getUserPagingList',
    method: 'get',
    params
  });
}

export function fetchSave(data: Api.Message.MessageModel) {
  return request({
    url: 'message/save',
    method: 'post',
    data
  });
}

export function fetchUpdate(data: Api.Message.MessageModel) {
  return request({
    url: 'message/update',
    method: 'post',
    data
  });
}

export function fetchDeletes(ids: number[]) {
  return request({
    url: '/message/delete',
    method: 'delete',
    data: ids,
  });
}
