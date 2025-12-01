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

  /** 检查用户名 */
  export function fetchCheckUserName(userName: string, id?: number) {
    return request({
      url: '/user/checkUserName',
      method: 'get',
      params: { userName, id }
    });
  }

  /** 检查邮箱 */
  export function fetchCheckEmail(email: string, id?: number) {
    return request({
      url: '/user/checkEmail',
      method: 'get',
      params: { email, id }
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

  /** 检查名称 */
  export function fetchCheckName(roleName: string, id?: number) {
    return request({
      url: '/role/checkName',
      method: 'get',
      params: { roleName, id }
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

  /** 保存角色 */
  export function fetchSave(data: Api.SystemManage.RoleModel) {
    const submitData = {
      ...data,
      isSystem: Boolean (data.isSystem)
    };
    let url = data.id === 0 ? '/role/add' : '/role/update';
    return request({
      url: url,
      method: 'post',
      data: submitData
    });
  }

  /** 删除角色 */
  export function fetchDelete(id: number) {
    let url = '/role/delete';
    return request({
      url: url,
      method: 'delete',
      params: { id }
    });
  }

  export function fetchDeletes(ids: number[]) {
    let url = '/role/deletes';
    return request({
      headers: { 'Content-Type': 'application/json' },
      url: url,
      method: 'delete',
      data: ids
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace PermissionApi {
    /** 权限列表 */
  export function fetchGetPermission(menuId: number, permissType?: string) {
    return request<Api.SystemManage.Permission[]>({
      url: '/permission/getPermissionList',
      method: 'get',
      params: { menuId, permissType }
    });
  }

  export function fetchGetRoleMenu(params?: number) {
    return request<number[]>({
      url: '/permission/getRoleMenuList',
      method: 'get',
      params: { roleId: params }
    });
  }

  export function fetchGetRolePermiss(roleId: number, menuId: number) {
    return request<Api.SystemManage.RolePermission[]>({
      url: '/permission/getRolePermissList',
      method: 'get',
      params: { roleId, menuId }
    });
  }

  export function fetchSave(data: Api.SystemManage.RolePermissModel) {
    let url = '/permission/save';
    return request({
      url: url,
      method: 'post',
      data
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

  /** 检查名称 */
  export function fetchCheckName(name: string, id?: number) {
    return request({
      url: '/menu/checkName',
      method: 'get',
      params: { name, id }
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
////////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace AuthorizeApi {
  /** 分页列表 */
  export function fetchGetPagingList(params?: Api.Authorize.AuthorizeSearchParams) {
    return request<Api.Authorize.AuthorizeList>({
      url: '/authorize/getPagingList',
      method: 'get',
      params
    });
  }

    /** 检查名称 */
  export function fetchCheckName(name: string, id?: number) {
    return request({
      url: '/authorize/checkName',
      method: 'get',
      params: { name, id }
    });
  }

  export function fetchDelete(id: number) {
    let url = '/authorize/delete';
    return request({
      url: url,
      method: 'delete',
      params: { id }
    });
  }

  export function fetchDeletes(ids: number[]) {
    let url = '/authorize/deletes';
    return request({
      headers: { 'Content-Type': 'application/json' },
      url: url,
      method: 'delete',
      data: ids
    });
  }
}
