import { request } from '../request';

/** test connection */
export function fetchTest(data: Api.DeviceConnection.DeviceConnectionModel) {
  return request({
    url: '/deviceconnection/testConnection',
    method: 'post',
    data
  })
}

/** get connection options   */
export function fetchGetConnectionOptions() {
  return request<Api.DeviceConnection.DeviceConnectionOptions>({
    url: '/deviceconnection/getOptions',
    method: 'get'
  });
}

/** get connection list */
export function fetchGetPagingList(params?: Api.DeviceConnection.DeviceConnectionSearchParams) {
  return request<Api.DeviceConnection.DeviceConnectionList>({
    url: '/deviceconnection/getPagingList',
    method: 'get',
    params
  });
}

/** get manufacturer list */
export function fetchGetManufacturerList() {
  return request<Api.DeviceConnection.ManufacturerList>({
    url: '/deviceconnection/getManufacturerList',
    method: 'get'
  });
}

export function fetchGetModel(id: number) {
  return request({
    url: '/deviceconnection/getModel',
    method: 'get',
    params: { id }
  });
}

/** check connection name*/
export function fetchCheckName(connectionName: string, createUserId: number, id: number) {
  return request({
    url: '/deviceconnection/checkName',
    method: 'get',
    params: { connectionName, createUserId, id }
  });
}

/** check device name*/
export function fetchCheckDeviceName(deviceName: string, createUserId: number, id: number) {
  return request({
    url: '/deviceconnection/checkDeviceName',
    method: 'get',
    params: { deviceName, createUserId, id }
  });
}

/** save connection */
export function fetchSave(data: Api.DeviceConnection.DeviceConnectionModel) {
  let url = data.id === 0 ? '/deviceconnection/add' : '/deviceconnection/update';
  return request({
    url: url,
    method: 'post',
    data
  });
}

/** delete connection by id */
export function fetchDelete(id: number) {
  return request({
    url: '/deviceconnection/delete',
    method: 'delete',
    params: { id }
  });
}
