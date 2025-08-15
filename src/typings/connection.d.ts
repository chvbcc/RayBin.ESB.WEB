declare namespace Api {
  namespace ConnectionTypes {
    /** Connection */
    type CommonSearchParams = Pick<Api.Common.PaginatingCommonParams, 'current' | 'size'>;

    /** Connection search params */
    type ConnectionSearchParams = Partial<
      Pick<Api.ConnectionTypes.Connection, 'connectionName' | 'databaseType' | 'hostName' | 'databases'> & Common.CommonSearchParams
    >;

    /** Connection list */
    type ConnectionList = Api.Common.PaginatingQueryRecord<Connection>;

    /** Hana, MySql, Oracle, SqlServer, PostgreSQL, OceanBase, PolarDB, GoldenDB, OpenGauss  */
    type DatabaseType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
    type ConnectionMode = '0' | '1' ;

    type Connection = Api.Common.CommonRecord<{
      id: number;
      connectionName: string;
      databaseType: DatabaseType;
      hostName: string;
      port: number;
      databases: string;
      userName: string;
      password: string;
      connectionString: string;
    }>;

    // 2. 定义模型类型
    type ConnectionModel = Pick<Api.ConnectionTypes.Connection, | 'id' | 'connectionName' | 'databaseType' | 'hostName' | 'port' | 'databases' | 'userName' | 'password' | 'connectionString' >;
  }
}
