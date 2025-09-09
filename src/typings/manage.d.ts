declare namespace Api {
  namespace SystemManage {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Role
    /* Role search params */
    type RoleSearchParams = Partial<Pick<Role, 'roleName' | 'isSystem' |  'description' | 'status'> & Common.CommonSearchParams>;

    /* Role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /* Role */
    type Role = Common.CommonRecord<{
      id: number;
      roleName: string;
      isSystem: Api.Common.YesOrNo;
      description: string;
    }>;

    /*  Roles dropdown */
    type Roles = Pick<Role, 'id' | 'roleName'>;

    /* Role model */
    type RoleModel = Pick<Role, | 'id' | 'roleName' | 'isSystem' | 'description' | 'status'>;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // User
    /* User search params */
    type UserSearchParams = Partial<Pick<User, 'username' | 'employeeName' | 'email' | 'status'> & Common.CommonSearchParams>;

    /* User list */
    type UserList = Common.PaginatingQueryRecord<User>;

    // female，male
    type Gender = '1' | '0';

    /* User */
    type User = Common.CommonRecord<{
      id: number;
      username: string;
      password: string;
      userAvatar: string;
      employeeName: string;
      employeeNo: string;
      gender: Gender;
      phone: string;
      email: string;
      weChat: string;
      dingDing: string;
    }>;

    /* User model */
    type UserModel = Pick<User, | 'id' | 'username' | 'password' | 'userAvatar' | 'employeeName' | 'employeeNo' | 'gender' | 'phone' | 'email' | 'weChat' | 'dingDing' | 'status'>;

    /* User dropdown */
    type Users = Pick<User, 'id' | 'username' | 'employeeName'>;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Permission
    type PermissionType = '0' | '1' | '2';

    /* Permission by menu id */
    type PermissionByMenuId = Partial<Pick<Permission, 'menuID'> & Common.CommonSearchParams>;

    type RolePermission = Pick<Permission, 'menuID' | 'permissCode' | 'permissType'>;

    type PermissionModel = Pick<Permission, 'menuID' | 'permissCode' | 'permissType' | 'description'>;

    type RolePermissModel =  {
        roleMenu: {
            roleID: number | null | undefined,
            menuID: number,
        }[],
        rolePermiss: {
            roleID: number,
            menuID: number,
            permissCode: string,
        }[]
    }

    type Permission = {
      menuID: number;
      menuTitle: string;
      permissCode: string;
      permissType: string;
      description: string;
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Menu
    /* Menu search params */
    type MenuSearchParams = Partial<Pick<Menu, 'name' | 'path' | 'title' | 'status'> & Common.CommonSearchParams>;

    // menu type "1": directory "2": menu
    type MenuType = '0' | '1';

    type MenuPropsOfRoute = Pick<import('vue-router').RouteMeta, | 'i18nKey' | 'keepAlive' | 'constant' | 'order' | 'href' | 'hideInMenu' | 'activeMenu' | 'multiTab' | 'fixedIndexInTab' | 'query'>;

    type Menu = Common.CommonRecord<{
      id: number;
      parentID: number;
      menuType: MenuType;
      title: string;
      name: string;
      path: string;
      component?: string;
      icon: string;
      localIcon: string;
      permissions?: PermissionModel[] | null;
      children?: Menu[];
    }> & MenuPropsOfRoute;

    /** menu model */
    type MenuModel = Pick<Menu, 'id' | 'menuType' | 'title' | 'name' | 'path' | 'component' | 'order' | 'i18nKey' | 'icon' | 'localIcon' | 'status' | 'parentID' | 'keepAlive' | 'constant' | 'href' | 'hideInMenu' | 'activeMenu' | 'multiTab' | 'fixedIndexInTab'> & {
      query: NonNullable<Menu['query']>;
      permissions: NonNullable<Menu['permissions']>;
      layout: string;
      page: string;
      pathParam: string;
    };

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      id: number;
      label: string;
      parentId: number;
      children?: MenuTree[];
    };
  }

}
