import { request } from '../request';

/** get connection list */
export function fetchGetConnectionList(params?: Api.AppTypes.ConnectionSearchParams) {
  return request<Api.AppTypes.ConnectionList>({
    url: '/connection/getList',
    method: 'get',
    params
  });
}
