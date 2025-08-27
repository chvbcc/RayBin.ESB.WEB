declare namespace Api {
  namespace SystemManage {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Role
    /* Role search params */
    type RoleSearchParams = Partial<Pick<Role, 'roleName' | 'IsSystem' |  'Description' | 'status'> & Common.CommonSearchParams>;

    /* Role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /* Role */
    type Role = Common.CommonRecord<{
      id: number;
      roleName: string;
      IsSystem: boolean;
      Description: string;
    }>;

    /*  Roles dropdown */
    type Roles = Pick<Role, 'id' | 'roleName'>;

    /* Role model */
    type RoleModel = Pick<Role, | 'id' | 'roleName' | 'IsSystem' | 'Description' | 'status'>;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // User
    /* User search params */
    type UserSearchParams = Partial<Pick<User, 'username' | 'employeeName' | 'email' | 'status'> & Common.CommonSearchParams>;

    /* User list */
    type UserList = Common.PaginatingQueryRecord<User>;

    // female，male
    type Gender = '0' | '1';

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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Menu
    // menu type "1": directory "2": menu
    type MenuType = '1' | '2';

    type MenuButton = { code: string; desc: string; };

    //icon type "1": iconify icon "2": local icon
    type IconType = '1' | '2';

    type MenuPropsOfRoute = Pick<
      import('vue-router').RouteMeta,
      | 'i18nKey'
      | 'keepAlive'
      | 'constant'
      | 'order'
      | 'href'
      | 'hideInMenu'
      | 'activeMenu'
      | 'multiTab'
      | 'fixedIndexInTab'
      | 'query'
    >;

    type Menu = Common.CommonRecord<{
      parentId: number;
      menuType: MenuType;
      menuName: string;
      routeName: string;
      routePath: string;
      component?: string;
      icon: string;
      iconType: IconType;
      buttons?: MenuButton[] | null;
      children?: Menu[];
    }> &
      MenuPropsOfRoute;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      id: number;
      label: string;
      pId: number;
      children?: MenuTree[];
    };
  }

}
