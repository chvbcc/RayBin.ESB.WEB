declare namespace Api {
  namespace Connection {
    /* Connection search params */
    type ConnectionSearchParams = Partial<Pick<Connection, 'connectionName' | 'databaseType' | 'hostName' | 'databases'> & Common.CommonSearchParams >;

    /* Connection list */
    type ConnectionList = Common.PaginatingQueryRecord<Connection>;
    type ConnectionOptions = Pick<Connection, 'id' | 'connectionName'>[];

    /* MySQL, PostgreSQL, Oracle, SQL Server, SAP HANA, PolarDB, GoldenDB, TiDB, OceanBase, DaMeng, OpenGauss, KingBase  */
    type DatabaseType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11';
    type ConnectionMode = '0' | '1' ;

    /* Connection */
    type Connection = Common.CommonRecord<{
      id: number;
      connectionName: string;
      databaseType: DatabaseType;
      hostName: string;
      port: number;
      databases: string;
      username: string;
      password: string;
      connectionString: string;
    }>;

    /* Connection model */
    type ConnectionModel = Pick<Connection, | 'id' | 'connectionName' | 'databaseType' | 'hostName' | 'port' | 'databases' | 'username' | 'password' | 'connectionString'>;
  }
}
