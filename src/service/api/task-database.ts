import { request } from '../request';

export function fetchCheckName(taskName: string, createUserId: number, id: number) {
  return request({
    url: '/taskdatabase/checkName',
    method: 'post',
    data: { taskName, createUserId, id }
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
  let url = data.id === 0 ? '/taskdatabase/add' : '/taskdatabase/update';
  return request({
    url: url,
    method: 'post',
    data
  });
}

export function fetchGetData() {
  return fetch('data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((err) => {
      console.error('Failed to load er.json', err);
      throw err;
    });
}
