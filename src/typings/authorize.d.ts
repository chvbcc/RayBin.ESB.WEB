declare namespace Api {
  namespace Authorize {
    /// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Authorize
    /* Authorize search params */
    /// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 认证类型
    enum AuthType {
      Custom = 0,
      ApiKey = 1,
      BasicAuth = 2,
      OAuth2Client = 3,
      OAuth2Password = 4,
      Jwt = 5,
      Ntlm = 6
    }

    // 参数类型
    enum CustomItemType {
      String = 0,
      Integer = 1,
      Boolean = 2,
      Number = 3
    }

    // 令牌检索类型
    enum TokenRetrievalType {
      TokenPath = 0, // 通过路径获取令牌
      TokenCode = 1 // 通过代码获取令牌
    }

    // 认证发送方式
    enum SendType {
      SendBasicAuth = 0,
      SendBody = 1
    }

    // 附加位置
    enum Location {
      Header = 0,
      Query = 1
    }

    // CustomItem 配置 Query Parameters, Headers
    type CustomItem = {
      name: string;
      value: string;
      valueType: CustomItemType;
      description: string;
    };

    // ApiKey 配置
    type ApiKeyConfig = {
      key: string;
      value: string;
    };

    // BasicAuth 认证配置
    type BasicAuthConfig = {
      username: string;
      password: string;
    };

    // OAuth2 认证配置 ClientCredentials
    type ClientConfig = {
      clientID: string; // 客户端 ID
      clientSecret: string; // 客户端密钥
      scopes: string[]; // 作用域
      clientAuthentication: SendType; // 认证方式
    };

    // OAuth2 认证配置 Password Credentials
    type PasswordConfig = {
      clientID: string; // 客户端 ID
      clientSecret: string; // 客户端密钥
      username: string; // 用户名
      password: string; // 密码
      scopes: string[]; // 作用域
    };

    // JWT 认证配置
    type JwtConfig = {
      algorithm: string; // 签名算法
      secret: string; // 签名密钥
      isSecretBase: Api.Common.YesOrNo; // 密钥是否为 Base64 编码
      payload: string; // 载荷内容（JSON 格式）
    };

    // NTLM 认证配置
    type NtlmConfig = {
      username: string;
      password: string;
      domain: string;
    };

    type AuthorizeSearchParams = Partial<
      Pick<Authorize, 'name' | 'method' | 'requestUrl' | 'startCreateTime' | 'endCreateTime'> &
        Common.CommonSearchParams
    >;

    /* Authorize */
    type Authorize = Common.CommonRecord<{
      name: string; // 名称
      method: string; // 请求方法
      requestUrl: string; // 请求地址
      timeOut: number; // 超时时间
      type: AuthType; // 认证类型
      customConfig: CustomItem[]; // Custom
      apiKeyConfig: ApiKeyConfig; // ApiKey
      basicAuthConfig: BasicAuthConfig; // Basic
      clientConfig: ClientConfig; // OAuth2 Client Credentials
      passwordConfig: PasswordConfig; // OAuth2 Password Credentials
      jwtConfig: JwtConfig; // JWT
      ntlmConfig: NtlmConfig; // NTLM
      tokenRetrievalType: TokenRetrievalType; // 令牌检索方式 分为路径，和代码
      tokenPath: string; // 令牌路径
      tokenCode: string; // 令牌代码
      programmeLanguage: string; // 程序语言
      tokenPassBy: Location; // 令牌传递位置
      tokenPrefix: string; // 令牌前缀（Query：access_token Header：Bearer）
      description: string;
      startCreateTime: string | undefined;
      endCreateTime: string | undefined;
    }>;

    type AuthorizeList = Common.PaginatingQueryRecord<Authorize>;
    /* Authorize model */
    type AuthorizeModel = Pick<Authorize,| 'id' | 'name' | 'method' | 'requestUrl' | 'timeOut' | 'type' | 'customConfig' | 'apiKeyConfig' | 'basicAuthConfig' | 'clientConfig'
      | 'passwordConfig' | 'jwtConfig' | 'ntlmConfig' | 'tokenRetrievalType' | 'tokenPath' | 'tokenCode' | 'programmeLanguage' | 'tokenPassBy' | 'tokenPrefix' | 'description' >;
  }
}
