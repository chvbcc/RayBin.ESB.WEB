declare namespace Api {
  namespace AppTypes {
    /** Connection */
    type CommonSearchParams = Pick<Api.Common.PaginatingCommonParams, 'current' | 'size'>;

    /** Connection search params */
    type ConnectionSearchParams = CommonType.RecordNullable<
      Pick<Api.AppTypes.Connection, 'connectionName' | 'databaseType' | 'hostName' | 'databases'> & CommonSearchParams
    >;

    /** Connection list */
    type ConnectionList = Api.Common.PaginatingQueryRecord<Connection>;

    /** Hana, MySql, Oracle, SqlServer, PostgreSQL, OceanBase, PolarDB, GoldenDB, OpenGauss  */
    type DatabaseType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

    type Connection = Api.Common.CommonRecord<{
      connectionName: string;
      databaseType: DatabaseType | null;
      hostName: string;
      databases: string;
    }>;
  }
}
