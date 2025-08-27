import { request } from '../request';

export namespace UserApi {
  /** get user list */
  export function fetchGetPagingList(params?: Api.SystemManage.UserSearchParams) {
    return request<Api.SystemManage.UserList>({
      url: '/user/getPagingList',
      method: 'get',
      params
    });
  }
}

export namespace RoleApi {
  /** get role list */
  export function fetchGetPagingList(params?: Api.SystemManage.RoleSearchParams) {
    return request<Api.SystemManage.RoleList>({
      url: '/role/getPagingList',
      method: 'get',
      params
    });
  }

  export function fetchGetList() {
    return request<Api.SystemManage.Roles[]>({
      url: '/role/getList',
      method: 'get'
    });
  }

  export function fetchGetRoles(userId: number) {
    return request<Api.SystemManage.Roles[]>({
      url: '/role/getRoles',
      method: 'get',
      params: { userId }
    });
  }
}

/**
 * get all roles
 * these roles are all enabled
 */


// /** get menu list */
// export function fetchGetMenuList() {
//   return request<Api.SystemManage.MenuList>({
//     url: '/systemManage/getMenuList/v2',
//     method: 'get'
//   });
// }

// /** get all pages */
// export function fetchGetAllPages() {
//   return request<string[]>({
//     url: '/systemManage/getAllPages',
//     method: 'get'
//   });
// }

// /** get menu tree */
// export function fetchGetMenuTree() {
//   return request<Api.SystemManage.MenuTree[]>({
//     url: '/systemManage/getMenuTree',
//     method: 'get'
//   });
// }
