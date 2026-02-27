// 解析连接字符串 为 model
export function parseConnectionString(model: Api.Connection.ConnectionModel) {
  const type = model.databaseType?.trim() ?? '';
  const connectionString = model.connectionString?.trim() ?? '';
  
  let serverMatch: RegExpMatchArray | null;
  let dbMatch: RegExpMatchArray | null;
  let userIdMatch: RegExpMatchArray | null;
  let pwdMatch: RegExpMatchArray | null;
  let portMatch: RegExpMatchArray | null;
  let hostMatch: RegExpMatchArray | null;
  let serviceNameMatch: RegExpMatchArray | null;
  let uidMatch: RegExpMatchArray | null;
  let usernameMatch: RegExpMatchArray | null;
  
  switch (type) {
    case '0': // MySQL
      serverMatch = connectionString.match(/Server=(.*?);/i);
      dbMatch = connectionString.match(/Database=(.*?);/i);
      uidMatch = connectionString.match(/Uid=(.*?);/i);
      pwdMatch = connectionString.match(/Pwd=(.*?);/i);
      portMatch = connectionString.match(/Port=(.*?);/i);
      if (serverMatch) model.hostName = serverMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (dbMatch) model.databases = dbMatch[1];
      if (uidMatch) model.username = uidMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '1': // PostgreSQL
      hostMatch = connectionString.match(/Host=(.*?);/i);
      dbMatch = connectionString.match(/Database=(.*?);/i);
      usernameMatch = connectionString.match(/Username=(.*?);/i);
      pwdMatch = connectionString.match(/Password=(.*?);/i);
      portMatch = connectionString.match(/Port=(.*?);/i);
      if (hostMatch) model.hostName = hostMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (dbMatch) model.databases = dbMatch[1];
      if (usernameMatch) model.username = usernameMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '2': // Oracle
      hostMatch = connectionString.match(/HOST=(.*?)(\)|;)/i);
      portMatch = connectionString.match(/PORT=(.*?)(\)|;)/i);
      serviceNameMatch = connectionString.match(/SERVICE_NAME=(.*?)(\)|;)/i);
      userIdMatch = connectionString.match(/User Id=(.*?);/i);
      pwdMatch = connectionString.match(/Password=(.*?);/i);
      if (hostMatch) model.hostName = hostMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (serviceNameMatch) model.databases = serviceNameMatch[1];
      if (userIdMatch) model.username = userIdMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '3': // SQL Server
      serverMatch = connectionString.match(/Server=(.*?);/i);
      dbMatch = connectionString.match(/Database=(.*?);/i);
      userIdMatch = connectionString.match(/User Id=(.*?);/i);
      pwdMatch = connectionString.match(/Password=(.*?);/i);
      if (serverMatch) model.hostName = serverMatch[1].split(',')[0];
      if (serverMatch && serverMatch[1].includes(',')) {
        model.port = parseInt(serverMatch[1].split(',')[1], 10);
      }
      else {
        model.port = 1433; // 默认端口
      }
      if (dbMatch) model.databases = dbMatch[1];
      if (userIdMatch) model.username = userIdMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '4': // SAP HANA
      serverMatch = connectionString.match(/Server=(.*?);/i);
      dbMatch = connectionString.match(/Database=(.*?);/i);
      uidMatch = connectionString.match(/Uid=(.*?);/i);
      pwdMatch = connectionString.match(/Pwd=(.*?);/i);
      portMatch = connectionString.match(/Port=(.*?);/i);
      if (serverMatch) model.hostName = serverMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (dbMatch) model.databases = dbMatch[1];
      if (uidMatch) model.username = uidMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '5': // PolarDB
      serverMatch = connectionString.match(/Server=(.*?);/i);
      dbMatch = connectionString.match(/Database=(.*?);/i);
      uidMatch = connectionString.match(/Uid=(.*?);/i);
      pwdMatch = connectionString.match(/Pwd=(.*?);/i);
      portMatch = connectionString.match(/Port=(.*?);/i);
      if (serverMatch) model.hostName = serverMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (dbMatch) model.databases = dbMatch[1];
      if (uidMatch) model.username = uidMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '6': // GoldenDB
      serverMatch = connectionString.match(/Server=(.*?);/i);
      dbMatch = connectionString.match(/Database=(.*?);/i);
      userIdMatch = connectionString.match(/UserID=(.*?);/i);
      pwdMatch = connectionString.match(/Password=(.*?);/i);
      if (serverMatch) model.hostName = serverMatch[1].split(':')[0];
      if (serverMatch && serverMatch[1].includes(':')) {
        model.port = parseInt(serverMatch[1].split(':')[1], 10);
      }
      if (dbMatch) model.databases = dbMatch[1];
      if (userIdMatch) model.username = userIdMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '7': // TiDB
      serverMatch = connectionString.match(/Server=(.*?);/i);
      dbMatch = connectionString.match(/Database=(.*?);/i);
      uidMatch = connectionString.match(/Uid=(.*?);/i);
      pwdMatch = connectionString.match(/Pwd=(.*?);/i);
      portMatch = connectionString.match(/Port=(.*?);/i);
      if (serverMatch) model.hostName = serverMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (dbMatch) model.databases = dbMatch[1];
      if (uidMatch) model.username = uidMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '8': // OceanBase
      hostMatch = connectionString.match(/HOST=(.*?)(\)|;)/i);
      portMatch = connectionString.match(/PORT=(.*?)(\)|;)/i);
      serviceNameMatch = connectionString.match(/SERVICE_NAME=(.*?)(\)|;)/i);
      userIdMatch = connectionString.match(/User Id=(.*?);/i);
      pwdMatch = connectionString.match(/Password=(.*?);/i);
      if (hostMatch) model.hostName = hostMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (serviceNameMatch) model.databases = serviceNameMatch[1];
      if (userIdMatch) model.username = userIdMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '9': // DaMeng
      serverMatch = connectionString.match(/Server=(.*?);/i);
      dbMatch = connectionString.match(/Database=(.*?);/i);
      uidMatch = connectionString.match(/Uid=(.*?);/i);
      pwdMatch = connectionString.match(/Pwd=(.*?);/i);
      portMatch = connectionString.match(/Port=(.*?);/i);
      if (serverMatch) model.hostName = serverMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (dbMatch) model.databases = dbMatch[1];
      if (uidMatch) model.username = uidMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '10': // OpenGauss
      hostMatch = connectionString.match(/Host=(.*?);/i);
      dbMatch = connectionString.match(/Database=(.*?);/i);
      usernameMatch = connectionString.match(/Username=(.*?);/i);
      pwdMatch = connectionString.match(/Password=(.*?);/i);
      portMatch = connectionString.match(/Port=(.*?);/i);
      if (hostMatch) model.hostName = hostMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (dbMatch) model.databases = dbMatch[1];
      if (usernameMatch) model.username = usernameMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    case '11': // KingBase
      serverMatch = connectionString.match(/Server=(.*?);/i);
      dbMatch = connectionString.match(/Database=(.*?);/i);
      uidMatch = connectionString.match(/Uid=(.*?);/i);
      pwdMatch = connectionString.match(/Pwd=(.*?);/i);
      portMatch = connectionString.match(/Port=(.*?);/i);
      if (serverMatch) model.hostName = serverMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (dbMatch) model.databases = dbMatch[1];
      if (uidMatch) model.username = uidMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    default:
      break;
  }
}

export function parseConnectionModel(model: Api.Connection.ConnectionModel) {
  const type = model.databaseType?.trim() ?? '';
  const host = model.hostName?.trim() ?? '';
  const db = model.databases?.trim() ?? '';
  const user = model.username?.trim() ?? '';
  const pwd = model.password ?? '';
  const port = model.port !== undefined && model.port !== null && String(model.port) !== '' ? Number(model.port) : undefined;

  let cs = '';
  let addr: string;
  
  switch (type) {
    case '0': // MySQL
      cs = `Server=${host};Database=${db};Uid=${user};Pwd=${pwd};${port ? `Port=${port};` : ''}`;
      break;
    case '1': // PostgreSQL
      cs = `Host=${host};Database=${db};Username=${user};Password=${pwd};${port ? `Port=${port};` : ''}`;
      break;
    case '2': // Oracle
      addr = `(PROTOCOL=TCP)(HOST=${host})${port ? `(PORT=${port})` : ''}`;
      cs = `Data Source=(DESCRIPTION=(ADDRESS=(${addr}))(CONNECT_DATA=(SERVICE_NAME=${db})));User Id=${user};Password=${pwd};`;
      break;
    case '3': // SQL Server
      cs = `Server=${host}${port ? `,${port}` : ''};Database=${db};User Id=${user};Password=${pwd};TrustServerCertificate=true;`;
      break;
    case '4': // SAP HANA
      cs = `Server=${host};Database=${db};Uid=${user};Pwd=${pwd};${port ? `Port=${port};` : ''}`;
      break;
    case '5': // PolarDB
      cs = `Server=${host};Database=${db};Uid=${user};Pwd=${pwd};${port ? `Port=${port};` : ''}`;
      break;
    case '6': // GoldenDB
      cs = `Server=${host}${port ? `:${port}` : ''};Database=${db};UserID=${user};Password=${pwd};`;
      break;
    case '7': // TiDB
      cs = `Server=${host};Database=${db};Uid=${user};Pwd=${pwd};${port ? `Port=${port};` : ''}`;
      break;
    case '8': // OceanBase
      addr = `(PROTOCOL=TCP)(HOST=${host})${port ? `(PORT=${port})` : ''}`;
      cs = `Data Source=(DESCRIPTION=(ADDRESS=(${addr}))(CONNECT_DATA=(SERVICE_NAME=${db})));User Id=${user};Password=${pwd};`;
      break;
    case '9': // DaMeng
      cs = `Server=${host};Database=${db};Uid=${user};Pwd=${pwd};${port ? `Port=${port};` : ''}`;
      break;
    case '10': // OpenGauss
      cs = `Host=${host};Database=${db};Username=${user};Password=${pwd};${port ? `Port=${port};` : ''}`;
      break;
    case '11': // KingBase
      cs = `Server=${host};Database=${db};Uid=${user};Pwd=${pwd};${port ? `Port=${port};` : ''}`;
      break;
    default:
      cs = '';
  }
  model.connectionString = cs;
  return cs;
}

// 连接字符串模板
export const connectionStringTemplates: Record<string, string> = {
  '0': 'Server=127.0.0.1;Database=myDB;Uid=root;Pwd=Pwd@123;Port=3306;',
  '1': 'Host=127.0.0.1;Database=myDB;Username=postgres;Password=Pwd@123;Port=5432;',
  '2': 'Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=127.0.0.1)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=myDB)));User Id=sys;Password=Pwd@123;',
  '3': 'Server=127.0.0.1;Database=myDB;User Id=sa;Password=Pwd@123;',
  '4': 'Server=127.0.0.1;Database=myDB;Uid=system;Pwd=Pwd@123;Port=30015;',
  '5': 'Server=127.0.0.1;Database=myDB;Uid=root;Pwd=Pwd@123;Port=3306;',
  '6': 'Server=127.0.0.1:30015;Database=myDB;UserID=system;Password=Pwd@123;',
  '7': 'Server=127.0.0.1;Database=myDB;Uid=root;Pwd=Pwd@123;Port=4000;',
  '8': 'Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=127.0.0.1)(PORT=2881))(CONNECT_DATA=(SERVICE_NAME=myDB)));User Id=sys;Password=Pwd@123;',
  '9': 'Server=127.0.0.1;Database=myDB;Uid=SYSDBA;Pwd=Pwd@123;Port=5236;',
  '10': 'Host=127.0.0.1;Database=myDB;Username=gaussdb;Password=Pwd@123;Port=5432;',
  '11': 'Server=127.0.0.1;Database=myDB;Uid=SYSTEM;Pwd=Pwd@123;Port=54321;'
};

// 根据数据库类型生成连接字符串
export function getConnectionStringByType(databaseType: string, model: { connectionString: string }) {
  const template = connectionStringTemplates[databaseType];
  if (template) {
    model.connectionString = template;
  } else {
    model.connectionString = '';
  }
}
