const local: App.I18n.Schema = {
  system: {
    title: 'RayBin ESB 6.0',
    updateTitle: '系统版本更新通知',
    updateContent: '检测到系统有新版本发布，是否立即刷新页面？',
    updateConfirm: '立即刷新',
    updateCancel: '稍后再说'
  },
  common: {
    action: '操作',
    add: '新增',
    addSuccess: '添加成功',
    addFailed: '添加失败',
    backToHome: '返回首页',
    batchDelete: '批量删除',
    cancel: '取消',
    close: '关闭',
    check: '勾选',
    columnSetting: '列设置',
    config: '配置',
    confirm: '确认',
    delete: '删除',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    confirmDelete: '确认删除吗？',
    edit: '编辑',
    error: '错误',
    index: '序号',
    keywordSearch: '请输入关键词搜索',
    logout: '退出登录',
    logoutConfirm: '确认退出登录吗？',
    lookForward: '敬请期待',
    modify: '修改',
    modifySuccess: '修改成功',
    modifyFailed: '修改失败',
    noData: '无数据',
    operate: '操作',
    pleaseCheckValue: '请检查输入的值是否合法',
    refresh: '刷新',
    reset: '重置',
    search: '搜索',
    switch: '切换',
    tip: '提示',
    trigger: '触发',
    update: '更新',
    updateSuccess: '更新成功',
    updateFailed: '更新失败',
    userCenter: '个人中心',
    yesOrNo: {
      yes: '是',
      no: '否'
    },
    success: '成功',
    fail: '失败',
    save: '保存',
    back: '返回',
    test: '测试',
    exists: '已存在',
    status: {
      enable: '启用',
      disable: '禁用'
    },
    fetchingDataError: '获取数据失败，请稍后重试!'
  },
  request: {
    logout: '请求失败后登出用户',
    logoutMsg: '用户状态失效，请重新登录',
    logoutWithModal: '请求失败后弹出模态框再登出用户',
    logoutWithModalMsg: '用户状态失效，请重新登录',
    refreshToken: '请求的token已过期，刷新token',
    tokenExpired: 'token已过期'
  },
  theme: {
    themeSchema: {
      title: '主题模式',
      light: '亮色模式',
      dark: '暗黑模式',
      auto: '跟随系统'
    },
    grayscale: '灰色模式',
    colourWeakness: '色弱模式',
    layoutMode: {
      title: '布局模式',
      vertical: '左侧菜单模式',
      'vertical-mix': '左侧菜单混合模式',
      horizontal: '顶部菜单模式',
      'horizontal-mix': '顶部菜单混合模式',
      reverseHorizontalMix: '一级菜单与子级菜单位置反转'
    },
    recommendColor: '应用推荐算法的颜色',
    recommendColorDesc: '推荐颜色的算法参照',
    themeColor: {
      title: '主题颜色',
      primary: '主色',
      info: '信息色',
      success: '成功色',
      warning: '警告色',
      error: '错误色',
      followPrimary: '跟随主色'
    },
    scrollMode: {
      title: '滚动模式',
      wrapper: '外层滚动',
      content: '主体滚动'
    },
    page: {
      animate: '页面切换动画',
      mode: {
        title: '页面切换动画类型',
        'fade-slide': '滑动',
        fade: '淡入淡出',
        'fade-bottom': '底部消退',
        'fade-scale': '缩放消退',
        'zoom-fade': '渐变',
        'zoom-out': '闪现',
        none: '无'
      }
    },
    fixedHeaderAndTab: '固定头部和标签栏',
    header: {
      height: '头部高度',
      breadcrumb: {
        visible: '显示面包屑',
        showIcon: '显示面包屑图标'
      }
    },
    tab: {
      visible: '显示标签栏',
      cache: '标签栏信息缓存',
      height: '标签栏高度',
      mode: {
        title: '标签栏风格',
        chrome: '谷歌风格',
        button: '按钮风格'
      }
    },
    sider: {
      inverted: '深色侧边栏',
      width: '侧边栏宽度',
      collapsedWidth: '侧边栏折叠宽度',
      mixWidth: '混合布局侧边栏宽度',
      mixCollapsedWidth: '混合布局侧边栏折叠宽度',
      mixChildMenuWidth: '混合布局子菜单宽度'
    },
    footer: {
      visible: '显示底部',
      fixed: '固定底部',
      height: '底部高度',
      right: '底部局右'
    },
    watermark: {
      visible: '显示全屏水印',
      text: '水印文本'
    },
    themeDrawerTitle: '主题配置',
    pageFunTitle: '页面功能',
    resetCacheStrategy: {
      title: '重置缓存策略',
      close: '关闭页面',
      refresh: '刷新页面'
    },
    configOperation: {
      copyConfig: '复制配置',
      copySuccessMsg: '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings',
      resetConfig: '重置配置',
      resetSuccessMsg: '重置成功'
    }
  },
  route: {
    login: '登录',
    403: '无权限',
    404: '页面不存在',
    500: '服务器错误',
    'iframe-page': '外链页面',
    home: '首页',
    connection: '数据库连接',
    connection_default: '数据库连接',
    connection_action: '数据库连接',
    database: '数据库任务',
    database_default: '数据库任务',
    database_action: '数据库任务',
    webapi: '网络接口任务',
    webapi_default: '网络接口任务',
    webapi_action: '网络接口',
    industria: '工业接口任务',
    industria_default: '工业接口任务',
    industria_action: '工业接口',
    pending: '待运行任务',
    suspended: '已暂停任务',
    tasklog: '任务日志',
    message: '通知消息',
    'user-center': '个人中心',
    manage: '系统管理',
    manage_user: '用户管理',
    'manage_user-detail': '用户详情',
    manage_role: '角色管理',
    manage_authorize: '授权管理',
    manage_authorize_default: '授权管理',
    manage_authorize_action: '授权',
    manage_menu: '菜单管理',
  },
  page: {
    login: {
      common: {
        loginOrRegister: '登录 / 注册',
        userNamePlaceholder: '请输入用户名',
        phonePlaceholder: '请输入手机号',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        codeLogin: '验证码登录',
        confirm: '确定',
        back: '返回',
        validateSuccess: '验证成功',
        loginSuccess: '登录成功',
        welcomeBack: '欢迎回来，{userName} ！'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        register: '注册账号',
        otherAccountLogin: '其他账号登录',
        otherLoginMode: '其他登录方式',
        superAdmin: '超级管理员',
        admin: '管理员',
        user: '普通用户'
      },
      codeLogin: {
        title: '验证码登录',
        getCode: '获取验证码',
        reGetCode: '{time}秒后重新获取',
        sendCodeSuccess: '验证码发送成功',
        imageCodePlaceholder: '请输入图片验证码'
      },
      register: {
        title: '注册账号',
        agreement: '我已经仔细阅读并接受',
        protocol: '《用户协议》',
        policy: '《隐私权政策》'
      },
      resetPwd: {
        title: '重置密码'
      },
      bindWeChat: {
        title: '绑定微信'
      }
    },
    about: {
      title: '关于',
      introduction: `SoybeanAdmin 是一个优雅且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite5, TypeScript, Pinia 和 UnoCSS。它内置了丰富的主题配置和组件，代码规范严谨，实现了自动化的文件路由系统。`,
      projectInfo: {
        title: '项目信息',
        version: '版本',
        latestBuildTime: '最新构建时间',
        githubLink: 'Github 地址',
        previewLink: '预览地址'
      },
      prdDep: '生产依赖',
      devDep: '开发依赖'
    },
    home: {
      greeting: '早安，{userName}, 今天又是充满活力的一天!',
      weatherDesc: '今日多云转晴，20℃ - 25℃!',
      projectCount: '项目数',
      todo: '待办',
      message: '消息',
      downloadCount: '下载量',
      registerCount: '注册量',
      schedule: '作息安排',
      study: '学习',
      work: '工作',
      rest: '休息',
      entertainment: '娱乐',
      visitCount: '访问量',
      turnover: '成交额',
      dealCount: '成交量',
      projectNews: {
        title: '项目动态',
        moreNews: '更多动态',
        desc1: 'Soybean 在2021年5月28日创建了开源项目 soybean-admin!',
        desc2: 'Yanbowe 向 soybean-admin 提交了一个bug，多标签栏不会自适应。',
        desc3: 'Soybean 准备为 soybean-admin 的发布做充分的准备工作!',
        desc4: 'Soybean 正在忙于为soybean-admin写项目说明文档！',
        desc5: 'Soybean 刚才把工作台页面随便写了一些，凑合能看了！'
      },
      creativity: '创意'
    },
    connection: {
      title: '数据库连接',
      add: '新增数据库连接',
      edit: '编辑数据库连接',
      connectionName: '连接名称',
      databaseType: '数据库类型',
      hostName: '主机名',
      port: '端口',
      databases: '数据库',
      username: '用户名',
      password: '密码',
      form: {
        connectionName: '请输入连接名称',
        databaseType: '请选择数据库类型',
        hostName: '请输入主机名',
        port: '请输入端口',
        databases: '请输入数据库名称',
        username: '请输入用户名',
        password: '请输入密码',
        connectionString: '请输入连接字符串',
      },
      connectionMode: '连接方式',
      mode: {
        custom: '自定义',
        connectionString: '连接字符串'
      },
      connectionSuccess: '连接成功',
      connectionString: '连接字符串',
    },
    task: {
      id: '任务编号',
      taskType: '任务类型',
      taskName: '任务名称',
      runMode: '运行方式',
      runTime: '运行时间',
      runFrequency: '运行频率',
      dataHandle: '数据处理',
      programmeLanguage: '编程语言',
      dataHandleScript: '数据处理脚本',
      isDebug: '调试模式',
      status: '任务状态',
      description: '任务描述',
      createUserID: '创建用户',
      createTime: '创建时间',
      form: {
        taskType: '请选择任务类型',
        taskName: '请输入任务名称',
        runMode: '请选择运行方式',
        runTime: '请输入运行时间',
        runFrequency: '请输入运行频率',
        dataHandle: '请选择数据处理',
        programmeLanguage: '请选择编程语言',
        dataHandleScript: '请输入数据处理脚本',
        isDebug: '请选择调试模式',
        status: '请选择任务状态',
        description: '请输入任务描述',
      },
      taskStatus: {
        normal: '正常',
        draft: '草稿',
        paused: '暂停'
      }
    },
    database: {
      title: '数据库任务',
      add: '新增数据库任务',
      edit: '编辑数据库任务',
      titleBaseInfo: '基本信息',
      titleDataMapping: '数据映射',
      dataObjectModalTitle: '选择数据对象',
      taskID: '任务编号',
      connectionID: '数据连接',
      dataObjectType: '对象类型',
      dataMapping: '数据映射',
      addMapping: '新增映射',
      createUserID: '创建用户',
      createTime: '创建时间',
      form: {
        connectionID: '请选择数据连接',
        dataObjectType: '请选择对象类型',
        dataMapping: '请输入数据映射',
      }
    },
    httpRequest:
    {
        paramName: '参数名',
        paramType: '参数类型',
        paramValue: '参数值',
        contentType: '内容类型',
        uploadFile: '上传文件',
        noBodyData: '无请求主体',
        description: '描述',
        form: {
            paramName: '请输入参数名',
            paramType: '请选择参数类型',
            paramValue: '请输入参数值',
            contentType: '请选择或输入内容类型',
            uploadFile: '点击上传文件',
            description: '请输入参数描述'
        }
    },
    taskLog: {
      title: '任务日志',
      taskID: '任务编号',
      taskType: '任务类型',
      taskName: '任务名称',
      logLevel: '日志级别',
      message: '日志信息',
      spentTime: '耗时 (ms)',
      createTime: '创建时间',
      form: {
        taskType: '请选择任务类型',
        logLevel: '请选择日志级别',
        taskName: '请输入任务名称',
      },
    },
    authorize: {
      title: '授权管理',
      titleBaseInfo: '基本信息',
      titleAuthorize: '授权设置',
      titleResponse: '响应内容',
      add: '新增授权',
      edit: '编辑授权',
      name: '授权名称',
      method: '请求方法',
      requestUrl: '请求URL',
      timeOut: '超时时间 (秒)',
      type: '授权类型',
      custom: {
        name: '参数名',
        value: '参数值',
        valueType: '参数类型',
        description: '描述',
        form: {
          name: '请输入参数名',
          value: '请输入参数值',
          valueType: '请选择参数类型',
          description: '请输入参数描述'
        }
      },
      apiKey: {
        key: '键名',
        value: '键值',
        form: {
          key: '请输入键名',
          value: '请输入键值'
        }
      },
      basicAuth: {
        username: '用户名',
        password: '密码',
        form: {
          username: '请输入用户名',
          password: '请输入密码'
        }
      },
      client: {
        clientID: '客户端 ID',
        clientSecret: '客户端密钥',
        scopes: '作用域',
        clientAuthentication: '认证方式',
        form: {
          clientID: '请输入客户端 ID',
          clientSecret: '请输入客户端密钥',
          scopes: '请输入作用域，多个用逗号分隔',
          clientAuthentication: '请选择认证方式'
        }
      },
      password: {
        clientID: '客户端 ID',
        clientSecret: '客户端密钥',
        username: '用户名',
        password: '密码',
        scopes: '作用域',
        form: {
          clientID: '请输入客户端 ID',
          clientSecret: '请输入客户端密钥',
          username: '请输入用户名',
          password: '请输入密码',
          scopes: '请输入作用域，多个用逗号分隔'
        }
      },
      jwt: {
        algorithm: '签名算法',
        secret: '签名密钥',
        isSecretBase: '密钥编码',
        payload: '负载内容',
        form: {
          algorithm: '请选择签名算法',
          secret: '请输入签名密钥',
          isSecretBase: '请选择密钥是否Base64编码',
          payload: '请输入负载内容'
        }
      },
      ntlm: {
        username: '用户名',
        password: '密码',
        domain: '域',
        form: {
          username: '请输入用户名',
          password: '请输入密码',
          domain: '请输入域',
        }
      },
      tokenRetrievalType: '检索方式',
      tokenPath: '令牌路径',
      getToken: '获取令牌',
      programmeLanguage: '编程语言',
      tokenCode: '令牌代码',
      tokenPassBy: '传递位置',
      tokenPrefix: '令牌前缀',
      description: '描述',
      createUserID: '创建用户',
      createTime: '创建时间',
      authorization: '认证',
      form: {
        name: '请输入授权名称',
        method: '请选择请求方法',
        requestUrl: '请输入请求URL',
        timeOut: '请输入超时时间',
        type: '请选择授权类型',
        tokenRetrievalType: '请选择令牌检索方式',
        tokenPath: '请输入令牌路径',
        tokenCode: '请选择请求体类型',
        tokenPassBy: '请选择令牌传递位置',
        programmeLanguage: '请选择编程语言',
        tokenPrefix: '请输入令牌前缀',
        description: '请输入描述',
      }
    },
    manage: {
      role: {
        title: '角色列表',
        roleName: '角色名称',
        isSystem: '系统角色',
        description: '角色描述',
        status: '角色状态',
        form: {
          roleName: '请输入角色名称',
          isSystem: '请选择是否为系统角色',
          description: '请输入角色描述',
          status: '请选择角色状态'
        },
        addRole: '新增角色',
        editRole: '编辑角色',
        menuAuth: '菜单权限',
        buttonAuth: '按钮权限'
      },
      user: {
        title: '用户',
        username: '用户名',
        password: '密码',
        userAvatar: '用户头像',
        employeeName: '姓名',
        employeeNo: '员工编号',
        gender: '性别',
        phone: '电话',
        email: '邮箱',
        weChat: '微信标识',
        dingDing: '钉钉标识',
        status: '状态',
        userRoles: '用户角色',
        form: {
          username: '请输入用户名',
          usernameLength: '用户名长度在3-20个字符之间',
          password: '请输入密码',
          passwordLength: '密码长度在6-20个字符之间',
          userAvatar: '请上传用户头像',
          employeeName: '请输入姓名',
          employeeNo: '请输入员工编号',
          gender: '请选择性别',
          phone: '请输入电话',
          email: '请输入邮箱',
          status: '请选择状态',
          userRoles: '请选择用户角色',
        },
        gendertype: {
          female: '女',
          male: '男'
        },
        addUser: '新增用户',
        editUser: '编辑用户',
      },
      menu: {
        home: '首页',
        pageTitle: '菜单列表',
        id: 'ID',
        parentID: '父级菜单ID',
        menuType: '菜单类型',
        title: '菜单名称',
        name: '路由名称',
        query: '路由参数',
        path: '路由路径',
        pathParam: '路径参数',
        layout: '布局',
        page: '页面组件',
        i18nKey: '国际化key',
        icon: 'Iconify 图标',
        localIcon: '本地图标',
        order: '排序',
        keepAlive: '缓存路由',
        href: '外链',
        hideInMenu: '隐藏菜单',
        activeMenu: '高亮的菜单',
        multiTab: '支持多页签',
        fixedIndexInTab: '固定在页签中的序号',
        status: '菜单状态',
        constant: '常量路由',
        tabMenu: '菜单信息',
        tabPermission: '权限设置',
        form: {
          home: '请选择首页',
          menuType: '请选择菜单类型',
          title: '请输入菜单名称',
          name: '请输入路由名称',
          path: '请输入路由路径',
          pathParam: '请输入路径参数',
          page: '请选择页面组件',
          layout: '请选择布局组件',
          i18nKey: '请输入国际化key',
          icon: '请输入 iconify 图标',
          queryKey: '请输入路由参数Key',
          queryValue: '请输入路由参数Value',
          localIcon: '请选择本地图标',
          order: '请输入排序',
          keepAlive: '请选择是否缓存路由',
          href: '请输入外链',
          hideInMenu: '请选择是否隐藏菜单',
          activeMenu: '请输入高亮的菜单的路由名称',
          multiTab: '请选择是否支持多标签',
          fixedInTab: '请选择是否固定在页签中',
          fixedIndexInTab: '请输入固定在页签中的序号',
          status: '请选择菜单状态'
        },
        addMenu: '新增菜单',
        editMenu: '编辑菜单',
        addChildMenu: '新增子菜单',
        type: {
          directory: '目录',
          menu: '菜单'
        },
        iconType: {
          iconify: 'iconify图标',
          local: '本地图标'
        }
      },
      permission: {
        title: '权限',
        menuTitle: '菜单名称',
        permissionSetting: '权限设置',
        permissCode: '权限编码',
        permissType: '权限类型',
        description: '权限描述',
        form: {
          permissCode: '请输入权限编码',
          permissType: '请选择权限类型',
          description: '请输入权限描述',
        },
        permissionType: {
          button: '按钮',
          column: '表格列',
          option: '选项'
        },
        addPermission: '新增权限',
        editPermission: '编辑权限',
      },
    }
  },
  form: {
    required: '不能为空',
    userName: {
      required: '请输入用户名',
      invalid: '用户名格式不正确'
    },
    phone: {
      required: '请输入手机号',
      invalid: '手机号格式不正确'
    },
    pwd: {
      required: '请输入密码',
      invalid: '密码格式不正确，6-18位字符，包含字母、数字、下划线'
    },
    confirmPwd: {
      required: '请输入确认密码',
      invalid: '两次输入密码不一致'
    },
    code: {
      required: '请输入验证码',
      invalid: '验证码格式不正确'
    },
    email: {
      required: '请输入邮箱',
      invalid: '邮箱格式不正确'
    }
  },
  dropdown: {
    closeCurrent: '关闭',
    closeOther: '关闭其它',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '关闭所有'
  },
  icon: {
    themeConfig: '主题配置',
    themeSchema: '主题模式',
    lang: '切换语言',
    fullscreen: '全屏',
    fullscreenExit: '退出全屏',
    reload: '刷新页面',
    collapse: '折叠菜单',
    expand: '展开菜单',
    pin: '固定',
    unpin: '取消固定'
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
      database: '数据库任务',
      webApi: '网络接口任务',
      industry: '工业PLC任务'
    },
    runMode: {
      manualOperation: '手动运行',
      everyDay: '每天运行',
      monthly: '每月运行',
      annually: '每年运行',
      timeInterval: '时间间隔',
    },
    dataObjectType: {
      table: '表',
      view: '视图',
      storedProcedure: '存储过程'
    },
    logLevel: {
      info: '信息',
      warning: '警告',
      error: '错误',
      debug: '调试'
    },
    requestType: {
      call: '调用接口',
      pull: '拉取数据',
      push: '推送数据'
    }
  },
};

export default local;
