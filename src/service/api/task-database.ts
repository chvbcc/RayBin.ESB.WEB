import { request } from '../request';

export function fetchCheckName(taskName: string, createUserId: number, id: number) {
  return request({
    url: '/taskdatabase/checkName',
    method: 'get',
    params: { taskName, createUserId, id }
  });
}

export function fetchGetModel(id: number) {
  return request({
    url: '/taskdatabase/getModel',
    method: 'get',
    params: { id }
  });
}

/** save task */
export function fetchSave(data: Api.Task.TaskDatabaseModel) {
  let url = data.task.id === 0 ? '/taskdatabase/add' : '/taskdatabase/update';
  return request({
    url: url,
    method: 'post',
    data
  });
}
