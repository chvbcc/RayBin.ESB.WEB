import { request } from '../request';

export function fetchGetDataObjectList(id: number, dataObjectType: Api.Task.DataObjectType) {
  switch (dataObjectType) {
    case 'table':
      return request({
        url: '/database/getTableList',
        method: 'get',
        params: { id }
      });
    case 'view':
      return request({
        url: '/database/getViewList',
        method: 'get',
        params: { id }
      });
    case 'storedProcedure':
      return request({
        url: '/database/getStoredProcedureList',
        method: 'get',
        params: { id }
      });
    default:
      return Promise.reject(new Error('Invalid data object type'));
  }
}

export function fetchGetDataObjects(id: number, dataObjectType: Api.Task.DataObjectType, dataObjectNames: string[]) {
  return request({
    url: '/database/getDataObjects',
    method: 'get',
    params: { id, dataObjectType, dataObjectNames }
  });
}
