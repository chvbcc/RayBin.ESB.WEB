import { request } from '../request';

export namespace UserApi {
  /** 分页列表 */
  export function fetchGetPagingList(params?: Api.SystemManage.UserSearchParams) {
    return request<Api.SystemManage.UserList>({
      url: '/user/getPagingList',
      method: 'get',
      params
    });
  }

  /** 保存用户 */
  export function fetchSave(data: Api.SystemManage.UserModel) {
    let url = data.id === 0 ? '/user/add' : '/user/update';
    return request({
      url: url,
      method: 'post',
      data
    });
  }

  /** 删除用户 */
  export function fetchDelete(id: number) {
    let url = '/user/delete';
    return request({
      url: url,
      method: 'delete',
      params: { id }
    });
  }

  export function fetchDeletes(ids: number[]) {
    let url = '/user/deletes';
    return request({
      headers: { 'Content-Type': 'application/json' },
      url: url,
      method: 'delete',
      data: ids
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace RoleApi {
  /** 分页列表 */
  export function fetchGetPagingList(params?: Api.SystemManage.RoleSearchParams) {
    return request<Api.SystemManage.RoleList>({
      url: '/role/getPagingList',
      method: 'get',
      params
    });
  }

  /** 获取所有角色 */
  export function fetchGetList() {
    return request<Api.SystemManage.Roles[]>({
      url: '/role/getList',
      method: 'get'
    });
  }

  /** 获取用户角色 */
  export function fetchGetRoles(userId: number) {
    return request<Api.SystemManage.Roles[]>({
      url: '/role/getRoles',
      method: 'get',
      params: { userId }
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace MenuApi {
  /** 分页列表 */
  export function fetchGetPagingList(params?: Api.SystemManage.MenuSearchParams) {
    return request<Api.SystemManage.MenuList>({
      url: '/menu/getPagingList',
      method: 'get',
      params
    });
  }

  /** 获取所有页面 */
  export function fetchGetPages() {
    return request<string[]>({
      url: '/menu/getPages',
      method: 'get'
    });
  }

  /** 获取菜单树 */
  export function fetchGetMenuTree() {
    return request<Api.SystemManage.MenuTree[]>({
      url: '/menu/getMenuTree',
      method: 'get'
    });
  }

  export function fetchSave(data: Api.SystemManage.MenuModel) {
    let url = data.id === 0 ? '/menu/add' : '/menu/update';
    return request({
      url: url,
      method: 'post',
      data
    });
  }

  /** 删除菜单 */
  export function fetchDelete(id: number) {
    let url = '/menu/delete';
    return request({
      url: url,
      method: 'delete',
      params: { id }
    });
  }

  export function fetchDeletes(ids: number[]) {
    let url = '/menu/deletes';
    return request({
      headers: { 'Content-Type': 'application/json' },
      url: url,
      method: 'delete',
      data: ids
    });
  }
}
