import { request } from '../request';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// task api
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace TaskApi {
  export function fetchGetPendingList(params?: Api.Task.TaskSearchParams) {
    return request<Api.Task.TaskList>({
      url: '/task/getPendingList',
      method: 'get',
      params
    });
  }

  export function fetchGetSuspendedList(params?: Api.Task.TaskSearchParams) {
    return request<Api.Task.TaskList>({
      url: '/task/getSuspendedList',
      method: 'get',
      params
    });
  }

  export function fetchRunTask(taskId: number) {
    return request({
      url: '/task/runTask',
      method: 'get',
      params: { taskId }
    });
  }

  export function fetchSetStatus(taskId: number, status: Api.Task.TaskStatus) {
    return request({
      url: '/task/setStatus',
      method: 'post',
      params: { taskId, status}
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// database schema api
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace DatabaseSchemaApi {
  export function fetchGetDataObjectList(id: number, dataObjectType: Api.Task.DataObjectType) {
    switch (dataObjectType) {
      case 'table':
        return request({
          url: '/databaseSchema/getTableList',
          method: 'get',
          params: { id }
        });
      case 'view':
        return request({
          url: '/databaseSchema/getViewList',
          method: 'get',
          params: { id }
        });
      case 'storedProcedure':
        return request({
          url: '/databaseSchema/getStoredProcedureList',
          method: 'get',
          params: { id }
        });
      default:
        return Promise.reject(new Error('Invalid data object type'));
    }
  }

  export function fetchGetDataObjects(id: number, dataObjectType: Api.Task.DataObjectType, dataObjectNames: string[]) {
    return request({
      url: '/databaseSchema/getDataObjects',
      method: 'get',
      params: { id, dataObjectType, dataObjectNames }
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// task database api
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace TaskDatabaseApi {
  export function fetchGetPagingList(params?: Api.Task.TaskSearchParams) {
    return request<Api.Task.TaskList>({
      url: '/taskdatabase/getPagingList',
      method: 'get',
      params
    });
  }

  export function fetchDelete(id: number) {
    return request({
      url: '/taskdatabase/delete',
      method: 'delete',
      params: { id }
    });
  }

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

  export function fetchSave(data: Api.Task.TaskDatabaseModel) {
    let url = data.task.id === 0 ? '/taskdatabase/add' : '/taskdatabase/update';
    return request({
      url: url,
      method: 'post',
      data
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// task web api
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace TaskWebApi {
  export function fetchGetPagingList(params?: Api.Task.TaskSearchParams) {
    return request<Api.Task.TaskList>({
      url: '/taskwebapi/getPagingList',
      method: 'get',
      params
    });
  }

  export function fetchGetList(taskId: number) {
    return request({
      url: '/taskwebapi/getList',
      method: 'get',
      params: { taskId }
    });
  }

  export function fetchGetAuthorizes(userId: number) {
    return request({
      url: '/taskwebapi/getAuthorizes',
      method: 'get',
      params: { userId }
    });
  }

  export function fetchGetModel(taskId: number) {
    return request({
      url: '/taskwebapi/getModel',
      method: 'get',
      params: { taskId }
    });
  }


  export function fetchDelete(id: number) {
    return request({
      url: '/taskwebapi/delete',
      method: 'delete',
      params: { id }
    });
  }
}
