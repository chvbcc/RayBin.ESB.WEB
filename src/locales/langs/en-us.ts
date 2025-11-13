const local: App.I18n.Schema = {
  system: {
    title: 'RayBin ESB 6.0',
    updateTitle: 'System Version Update Notification',
    updateContent: 'A new version of the system has been detected. Do you want to refresh the page immediately?',
    updateConfirm: 'Refresh immediately',
    updateCancel: 'Later'
  },
  common: {
    action: 'Action',
    add: 'Add',
    addSuccess: 'Add Success',
    addFailed: 'Add Failed',
    backToHome: 'Back to home',
    batchDelete: 'Batch Delete',
    cancel: 'Cancel',
    close: 'Close',
    check: 'Check',
    columnSetting: 'Column Setting',
    config: 'Config',
    confirm: 'Confirm',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    deleteFailed: 'Delete Failed',
    confirmDelete: 'Are you sure you want to delete?',
    edit: 'Edit',
    error: 'Error',
    index: 'Index',
    keywordSearch: 'Please enter keyword',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    lookForward: 'Coming soon',
    modify: 'Modify',
    modifySuccess: 'Modify Success',
    noData: 'No Data',
    operate: 'Operate',
    pleaseCheckValue: 'Please check whether the value is valid',
    refresh: 'Refresh',
    reset: 'Reset',
    search: 'Search',
    switch: 'Switch',
    tip: 'Tip',
    trigger: 'Trigger',
    update: 'Update',
    updateSuccess: 'Update Success',
    userCenter: 'User Center',
    yesOrNo: {
      yes: 'Yes',
      no: 'No'
    },
    success: 'Success',
    fail: 'Fail',
    save: 'Save',
    back: 'Back',
    test: 'Test',
    exists: 'already exists',
    status: {
      enable: 'Enable',
      disable: 'Disable'
    },
    fetchingDataError: 'Failed to fetch data, please try again later!'
  },
  request: {
    logout: 'Logout user after request failed',
    logoutMsg: 'User status is invalid, please log in again',
    logoutWithModal: 'Pop up modal after request failed and then log out user',
    logoutWithModalMsg: 'User status is invalid, please log in again',
    refreshToken: 'The requested token has expired, refresh the token',
    tokenExpired: 'The requested token has expired'
  },
  theme: {
    themeSchema: {
      title: 'Theme Schema',
      light: 'Light',
      dark: 'Dark',
      auto: 'Follow System'
    },
    grayscale: 'Grayscale',
    colourWeakness: 'Colour Weakness',
    layoutMode: {
      title: 'Layout Mode',
      vertical: 'Vertical Menu Mode',
      horizontal: 'Horizontal Menu Mode',
      'vertical-mix': 'Vertical Mix Menu Mode',
      'horizontal-mix': 'Horizontal Mix menu Mode',
      reverseHorizontalMix: 'Reverse first level menus and child level menus position'
    },
    recommendColor: 'Apply Recommended Color Algorithm',
    recommendColorDesc: 'The recommended color algorithm refers to',
    themeColor: {
      title: 'Theme Color',
      primary: 'Primary',
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      followPrimary: 'Follow Primary'
    },
    scrollMode: {
      title: 'Scroll Mode',
      wrapper: 'Wrapper',
      content: 'Content'
    },
    page: {
      animate: 'Page Animate',
      mode: {
        title: 'Page Animate Mode',
        fade: 'Fade',
        'fade-slide': 'Slide',
        'fade-bottom': 'Fade Zoom',
        'fade-scale': 'Fade Scale',
        'zoom-fade': 'Zoom Fade',
        'zoom-out': 'Zoom Out',
        none: 'None'
      }
    },
    fixedHeaderAndTab: 'Fixed Header And Tab',
    header: {
      height: 'Header Height',
      breadcrumb: {
        visible: 'Breadcrumb Visible',
        showIcon: 'Breadcrumb Icon Visible'
      }
    },
    tab: {
      visible: 'Tab Visible',
      cache: 'Tag Bar Info Cache',
      height: 'Tab Height',
      mode: {
        title: 'Tab Mode',
        chrome: 'Chrome',
        button: 'Button'
      }
    },
    sider: {
      inverted: 'Dark Sider',
      width: 'Sider Width',
      collapsedWidth: 'Sider Collapsed Width',
      mixWidth: 'Mix Sider Width',
      mixCollapsedWidth: 'Mix Sider Collapse Width',
      mixChildMenuWidth: 'Mix Child Menu Width'
    },
    footer: {
      visible: 'Footer Visible',
      fixed: 'Fixed Footer',
      height: 'Footer Height',
      right: 'Right Footer'
    },
    watermark: {
      visible: 'Watermark Full Screen Visible',
      text: 'Watermark Text'
    },
    themeDrawerTitle: 'Theme Configuration',
    pageFunTitle: 'Page Function',
    resetCacheStrategy: {
      title: 'Reset Cache Strategy',
      close: 'Close Page',
      refresh: 'Refresh Page'
    },
    configOperation: {
      copyConfig: 'Copy Config',
      copySuccessMsg: 'Copy Success, Please replace the variable "themeSettings" in "src/theme/settings.ts"',
      resetConfig: 'Reset Config',
      resetSuccessMsg: 'Reset Success'
    }
  },
  route: {
    login: 'Login',
    403: 'No Permission',
    404: 'Page Not Found',
    500: 'Server Error',
    'iframe-page': 'Iframe',
    home: 'Home',
    connection: 'Database Connection',
    "connection-action": 'Database Connection',
    database: 'Database Task',
    "database-action": 'Database Task',
    webapi: 'Web API Task',
    "webapi-action": 'Web API Task',
    industria: 'Industrial Interface Task',
    "industria-action": 'Industrial Interface Task',
    pending: 'Pending Task',
    suspended: 'Suspended Task',
    tasklog: 'Task Log',
    message: 'Notification Message',
    'user-center': 'User Center',
    manage: 'System Manage',
    manage_user: 'User Manage',
    'manage_user-detail': 'User Detail',
    manage_role: 'Role Manage',
    manage_menu: 'Menu Manage',
  },
  page: {
    login: {
      common: {
        loginOrRegister: 'Login / Register',
        userNamePlaceholder: 'Please enter user name',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        loginSuccess: 'Login successfully',
        welcomeBack: 'Welcome back, {userName} !'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        register: 'Register',
        otherAccountLogin: 'Other Account Login',
        otherLoginMode: 'Other Login Mode',
        superAdmin: 'Super Admin',
        admin: 'Admin',
        user: 'User'
      },
      codeLogin: {
        title: 'Verification Code Login',
        getCode: 'Get verification code',
        reGetCode: 'Reacquire after {time}s',
        sendCodeSuccess: 'Verification code sent successfully',
        imageCodePlaceholder: 'Please enter image verification code'
      },
      register: {
        title: 'Register',
        agreement: 'I have read and agree to',
        protocol: '《User Agreement》',
        policy: '《Privacy Policy》'
      },
      resetPwd: {
        title: 'Reset Password'
      },
      bindWeChat: {
        title: 'Bind WeChat'
      }
    },
    about: {
      title: 'About',
      introduction: `SoybeanAdmin is an elegant and powerful admin template, based on the latest front-end technology stack, including Vue3, Vite5, TypeScript, Pinia and UnoCSS. It has built-in rich theme configuration and components, strict code specifications, and an automated file routing system. In addition, it also uses the online mock data solution based on ApiFox. SoybeanAdmin provides you with a one-stop admin solution, no additional configuration, and out of the box. It is also a best practice for learning cutting-edge technologies quickly.`,
      projectInfo: {
        title: 'Project Info',
        version: 'Version',
        latestBuildTime: 'Latest Build Time',
        githubLink: 'Github Link',
        previewLink: 'Preview Link'
      },
      prdDep: 'Production Dependency',
      devDep: 'Development Dependency'
    },
    home: {
      greeting: 'Good morning, {userName}, today is another day full of vitality!',
      weatherDesc: 'Today is cloudy to clear, 20℃ - 25℃!',
      projectCount: 'Project Count',
      todo: 'Todo',
      message: 'Message',
      downloadCount: 'Download Count',
      registerCount: 'Register Count',
      schedule: 'Work and rest Schedule',
      study: 'Study',
      work: 'Work',
      rest: 'Rest',
      entertainment: 'Entertainment',
      visitCount: 'Visit Count',
      turnover: 'Turnover',
      dealCount: 'Deal Count',
      projectNews: {
        title: 'Project News',
        moreNews: 'More News',
        desc1: 'Soybean created the open source project soybean-admin on May 28, 2021!',
        desc2: 'Yanbowe submitted a bug to soybean-admin, the multi-tab bar will not adapt.',
        desc3: 'Soybean is ready to do sufficient preparation for the release of soybean-admin!',
        desc4: 'Soybean is busy writing project documentation for soybean-admin!',
        desc5: 'Soybean just wrote some of the workbench pages casually, and it was enough to see!'
      },
      creativity: 'Creativity'
    },
    connection: {
      title: 'Database Connection',
      connectionName: 'Connection Name',
      databaseType: 'Database Type',
      hostName: 'Host Name',
      databases: 'Databases',
      port: 'Port',
      username: 'User Name',
      password: 'Password',
      form: {
        connectionName: 'Please enter connection name',
        databaseType: 'Please select database type',
        hostName: 'Please enter host name',
        port: 'Please enter port',
        databases: 'Please enter databases',
        username: 'Please enter user name',
        password: 'Please enter password',
        connectionString: 'Please enter connection string'
      },
      connectionMode: 'Connection Mode',
      mode: {
        custom: 'Custom',
        connectionString: 'Connection String'
      },
      connectionSuccess: 'Connection Successful',
      connectionString: 'Connection String'
    },
    task: {
      id: 'Task No.',
      taskType: 'Task Type',
      taskName: 'Task Name',
      runMode: 'Run Mode',
      runTime: 'Run Time',
      runFrequency: 'Run Frequency',
      dataHandle: 'Data Handle',
      programmeLanguage: 'Program Language',
      dataHandleScript: 'Data Handle Script',
      isDebug: 'Is Debug',
      status: 'Task Status',
      description: 'Task Description',
      createUserID: 'Create User ID',
      createTime: 'Create Time',
      form: {
        taskType: 'Please select task type',
        taskName: 'Please enter task name',
        runMode: 'Please select run mode',
        runTime: 'Please enter run time',
        runFrequency: 'Please enter run frequency',
        dataHandle: 'Please select data handle',
        programmeLanguage: 'Please select programme language',
        dataHandleScript: 'Please enter data handle script',
        isDebug: 'Please select is debug',
        description: 'Please enter task description',
        status: 'Please select task status'
      },
      taskStatus: {
        normal: 'Normal',
        draft: 'Draft',
        paused: 'Paused'
      }
    },
    database: {
      title: 'Database Task',
      titleBaseInfo: 'Basic Info',
      titleDataMapping: 'Data Mapping',
      dataObjectModalTitle: 'Data Object Selection',
      taskID: 'Task No.',
      connectionID: 'Data Connection',
      dataObjectType: 'Data Object Type',
      dataMapping: 'Data Mapping',
      addMapping: 'Add Mapping',
      createUserID: 'Create User ID',
      createTime: 'Create Time',
      form: {
        connectionID: 'Please select data connection',
        dataObjectType: 'Please select data object type',
        dataMapping: 'Please enter data mapping',
      }
    },
    taskLog: {
      title: 'Task Log',
      taskID: 'Task No.',
      taskType: 'Task Type',
      taskName: 'Task Name',
      logLevel: 'Log Level',
      message: 'Message',
      spentTime: 'Spent Time (ms)',
      createTime: 'Create Time',
      form: {
        taskType: 'Please select task type',
        logLevel: 'Please select log level',
        taskName: 'Please enter task name',
      },
    },
    manage: {
      role: {
        title: 'Role List',
        roleName: 'Role Name',
        isSystem: 'System Role',
        description: 'Role Description',
        status: 'Role Status',
        form: {
          roleName: 'Please enter role name',
          isSystem: 'Please select system role',
          description: 'Please enter role description',
          status: 'Please select role status'
        },
        addRole: 'Add Role',
        editRole: 'Edit Role',
        menuAuth: 'Menu Auth',
        buttonAuth: 'Button Auth'
      },
      user: {
        title: 'User',
        username: 'Username',
        password: 'Password',
        userAvatar: 'User Avatar',
        employeeName: 'Name',
        employeeNo: 'Employee Number',
        gender: 'Gender',
        phone: 'Phone',
        email: 'Email',
        weChat: 'WeChat ID',
        dingDing: 'DingDing ID',
        status: 'Status',
        userRoles: 'User Role',
        form: {
          username: 'Please enter username',
          usernameLength: 'Username length is between 3-20 characters',
          password: 'Please enter password',
          passwordLength: 'Password length is between 6-20 characters',
          userAvatar: 'Please upload user avatar',
          employeeName: 'Please enter name',
          employeeNo: 'Please enter employee number',
          gender: 'Please select gender',
          phone: 'Please enter phone',
          email: 'Please enter email',
          status: 'Please select status',
          userRoles: 'Please select user role',
        },
        gendertype: {
          male: 'Male',
          female: 'Female'
        },
        addUser: 'Add User',
        editUser: 'Edit User',
      },
      menu: {
        home: 'Home',
        pageTitle: 'Menu List',
        id: 'ID',
        parentID: 'Parent ID',
        menuType: 'Menu Type',
        title: 'Menu Name',
        query: 'Query Params',
        name: 'Route Name',
        path: 'Route Path',
        layout: 'Layout Component',
        page: 'Page Component',
        i18nKey: 'I18n Key',
        icon: 'Iconify Icon',
        localIcon: 'Local Icon',
        constant: 'Constant',
        order: 'Order',
        keepAlive: 'Keep Alive',
        pathParam: 'Path Param',
        href: 'Href',
        hideInMenu: 'Hide In Menu',
        activeMenu: 'Active Menu',
        multiTab: 'Multi Tab',
        fixedIndexInTab: 'Fixed Index In Tab',
        status: 'Menu Status',
        tabMenu: 'Menu Info',
        tabPermission: 'Permission Settings',
        form: {
          home: 'Please select home',
          menuType: 'Please select menu type',
          title: 'Please enter menu name',
          name: 'Please enter route name',
          path: 'Please enter route path',
          pathParam: 'Please enter path param',
          page: 'Please select page component',
          layout: 'Please select layout component',
          i18nKey: 'Please enter i18n key',
          icon: 'Please enter iconify name',
          localIcon: 'Please enter local icon name',
          order: 'Please enter order',
          keepAlive: 'Please select whether to cache route',
          href: 'Please enter href',
          hideInMenu: 'Please select whether to hide menu',
          activeMenu: 'Please enter the route name of the highlighted menu',
          multiTab: 'Please select whether to support multiple tabs',
          queryKey: 'Please enter route parameter Key',
          queryValue: 'Please enter route parameter Value',
          fixedInTab: 'Please select whether to fix in the tab',
          fixedIndexInTab: 'Please enter the index fixed in the tab',
          status: 'Please select menu status'
        },
        addMenu: 'Add Menu',
        editMenu: 'Edit Menu',
        addChildMenu: 'Add Child Menu',
        type: {
          directory: 'Directory',
          menu: 'Menu'
        },
        iconType: {
          iconify: 'Iconify Icon',
          local: 'Local Icon'
        }
      },
      permission: {
        title: 'Permission',
        menuTitle: 'Menu Name',
        permissionSetting: 'Permission Setting',
        permissCode: 'Permission Code',
        permissType: 'Permission Type',
        description: 'Permission Description',
        form: {
          permissCode: 'Please enter permission code',
          permissType: 'Please select permission type',
          description: 'Please enter permission description',
        },
        permissionType: {
          button: 'Button',
          column: 'Column',
          option: 'Options'
        },
        addPermission: 'Add Permission',
        editPermission: 'Edit Permission',
      },
    }
  },
  form: {
    required: 'Cannot be empty',
    userName: {
      required: 'Please enter user name',
      invalid: 'User name format is incorrect'
    },
    phone: {
      required: 'Please enter phone number',
      invalid: 'Phone number format is incorrect'
    },
    pwd: {
      required: 'Please enter password',
      invalid: '6-18 characters, including letters, numbers, and underscores'
    },
    confirmPwd: {
      required: 'Please enter password again',
      invalid: 'The two passwords are inconsistent'
    },
    code: {
      required: 'Please enter verification code',
      invalid: 'Verification code format is incorrect'
    },
    email: {
      required: 'Please enter email',
      invalid: 'Email format is incorrect'
    }
  },
  dropdown: {
    closeCurrent: 'Close Current',
    closeOther: 'Close Other',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All'
  },
  icon: {
    themeConfig: 'Theme Configuration',
    themeSchema: 'Theme Schema',
    lang: 'Switch Language',
    fullscreen: 'Fullscreen',
    fullscreenExit: 'Exit Fullscreen',
    reload: 'Reload Page',
    collapse: 'Collapse Menu',
    expand: 'Expand Menu',
    pin: 'Pin',
    unpin: 'Unpin'
  },
  dropdownList: {
    databaseType: {
      hana: 'Hana',
      mySql: 'MySql',
      oracle: 'Oracle',
      sqlServer: 'SqlServer',
      postgreSQL: 'PostgreSQL',
      oceanBase: 'OceanBase',
      polarDB: 'PolarDB',
      goldenDB: 'GoldenDB',
      openGauss: 'OpenGauss'
    },
    taskType: {
      database: 'Database',
      webApi: 'WebApi',
      industry: 'Industry PLC'
    },
    runMode: {
      manualOperation: 'Manual Operation',
      everyDay: 'Every Day',
      monthly: 'Monthly',
      annually: 'Annually',
      timeInterval: 'Time Interval',
    },
    dataObjectType: {
      table: 'Table',
      view: 'View',
      storedProcedure: 'Stored Procedure'
    },
    logLevel: {
      info: 'Info',
      warning: 'Warning',
      error: 'Error',
      debug: 'Debug'
    }
  },
};

export default local;
