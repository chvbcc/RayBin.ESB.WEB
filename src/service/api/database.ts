import { request } from '../request';

export function fetchGetDataObjectList(id: number, dataObjectType: Api.Task.DataObjectType) {
  switch (dataObjectType) {
    case 'table':
      return fetchGetTableList(id);
    case 'view':
      return fetchGetViewList(id);
    case 'storedProcedure':
      return fetchGetStoredProcedureList(id);
    default:
      return Promise.reject(new Error('Invalid data object type'));
  }
}

export function fetchGetTableList(id: number) {
  return request({
    url: '/database/getTableList',
    method: 'get',
    params: { id }
  });
}

export function fetchGetViewList(id: number) {
  return request({
    url: '/database/getViewList',
    method: 'get',
    params: { id }
  });
}

export function fetchGetColumnList(id: number, tableViewName: string) {
  return request({
    url: '/database/getColumnList',
    method: 'get',
    params: { id, tableViewName }
  });
}

export function fetchGetStoredProcedureList(id: number) {
  return request({
    url: '/database/getStoredProcedureList',
    method: 'get',
    params: { id }
  });
}

export function fetchGetParameterList(id: number, storedProcedureName: string) {
  return request({
    url: '/database/getStoredProcedureParameterList',
    method: 'get',
    params: { id, storedProcedureName }
  });
}
