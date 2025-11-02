import { request } from '../request';

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
