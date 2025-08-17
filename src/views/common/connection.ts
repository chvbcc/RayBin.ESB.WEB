// 解析连接字符串 为 model
export function  parseConnectionString(model: Api.ConnectionTypes.ConnectionModel) {
  const type = model.databaseType?.trim() ?? '';
  const connectionString = model.connectionString?.trim() ?? '';
  switch (type) {
    case '0': {
      const serverMatch = connectionString.match(/Server=(.*?);/i);
      const dbMatch = connectionString.match(/Database=(.*?);/i);
      const userIdMatch = connectionString.match(/UserID=(.*?);/i);
      const pwdMatch = connectionString.match(/Password=(.*?);/i);
      if (serverMatch) model.hostName = serverMatch[1].split(':')[0];
      if (serverMatch && serverMatch[1].includes(':')) {
        model.port = parseInt(serverMatch[1].split(':')[1], 10);
      }
      if (dbMatch) model.databases = dbMatch[1];
      if (userIdMatch) model.username = userIdMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    }
    case '1':
    case '6':
    case '7': {
      const serverMatch = connectionString.match(/Server=(.*?);/i);
      const dbMatch = connectionString.match(/Database=(.*?);/i);
      const uidMatch = connectionString.match(/Uid=(.*?);/i);
      const pwdMatch = connectionString.match(/Pwd=(.*?);/i);
      const portMatch = connectionString.match(/Port=(.*?);/i);
      if (serverMatch) model.hostName = serverMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (dbMatch) model.databases = dbMatch[1];
      if (uidMatch) model.username = uidMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    }
    case '2':
    case '5': {
      const hostMatch = connectionString.match(/HOST=(.*?)(\)|;)/i);
      const portMatch = connectionString.match(/PORT=(.*?)(\)|;)/i);
      const serviceNameMatch = connectionString.match(/SERVICE_NAME=(.*?)(\)|;)/i);
      const userIdMatch = connectionString.match(/User Id=(.*?);/i);
      const pwdMatch = connectionString.match(/Password=(.*?);/i);
      if (hostMatch) model.hostName = hostMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (serviceNameMatch) model.databases = serviceNameMatch[1];
      if (userIdMatch) model.username = userIdMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    }
    case '3': {
      const serverMatch = connectionString.match(/Server=(.*?);/i);
      const dbMatch = connectionString.match(/Database=(.*?);/i);
      const userIdMatch = connectionString.match(/User Id=(.*?);/i);
      const pwdMatch = connectionString.match(/Password=(.*?);/i);
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
    }
    case '4':
    case '8': {
      const hostMatch = connectionString.match(/Host=(.*?);/i);
      const dbMatch = connectionString.match(/Database=(.*?);/i);
      const usernameMatch = connectionString.match(/Username=(.*?);/i);
      const pwdMatch = connectionString.match(/Password=(.*?);/i);
      const portMatch = connectionString.match(/Port=(.*?);/i);
      if (hostMatch) model.hostName = hostMatch[1];
      if (portMatch) model.port = parseInt(portMatch[1], 10);
      if (dbMatch) model.databases = dbMatch[1];
      if (usernameMatch) model.username = usernameMatch[1];
      if (pwdMatch) model.password = pwdMatch[1];
      break;
    }
    default:
      break;
  }
}


export function parseConnectionModel(model: Api.ConnectionTypes.ConnectionModel) {
  const type = model.databaseType?.trim() ?? '';
  const host = model.hostName?.trim() ?? '';
  const db = model.databases?.trim() ?? '';
  const user = model.username?.trim() ?? '';
  const pwd = model.password ?? '';
  const port = model.port !== undefined && model.port !== null && String(model.port) !== '' ? Number(model.port) : undefined;

  let cs = '';
  switch (type) {
    case '0': // Server=host:port;Database=...;UserID=...;Password=...;
      cs = `Server=${host}${port ? `:${port}` : ''};Database=${db};UserID=${user};Password=${pwd};`;
      break;
    case '1': // MySQL
    case '6':
    case '7': // Server=host;Database=...;Uid=...;Pwd=...;Port=...
      cs = `Server=${host};Database=${db};Uid=${user};Pwd=${pwd};${port ? `Port=${port};` : ''}`;
      break;
    case '2': // Oracle
    case '5': { // Data Source=(DESCRIPTION=...);User Id=...;Password=...;
      const addr = `(PROTOCOL=TCP)(HOST=${host})${port ? `(PORT=${port})` : ''}`;
      cs = `Data Source=(DESCRIPTION=(ADDRESS=(${addr}))(CONNECT_DATA=(SERVICE_NAME=${db})));User Id=${user};Password=${pwd};`;
      break;
    }
    case '3': // SQL Server: Server=host,port;Database=...;User Id=...;Password=...;
      cs = `Server=${host}${port ? `,${port}` : ''};Database=${db};User Id=${user};Password=${pwd};`;
      break;
    case '4': // PostgreSQL
    case '8': // Host=...;Database=...;Username=...;Password=...;Port=...
      cs = `Host=${host};Database=${db};Username=${user};Password=${pwd};${port ? `Port=${port};` : ''}`;
      break;
    default:
      cs = '';
  }
  model.connectionString = cs;
  return cs;
}

// 连接字符串模板
export const connectionStringTemplates: Record<string, string> = {
  '0': 'Server=127.0.0.1:30015;Database=myDB;UserID=system;Password=Pwd@123;',
  '1': 'Server=127.0.0.1;Database=myDB;Uid=root;Pwd=Pwd@123;Port=3306;',
  '2': 'Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=127.0.0.1)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=myDB)));User Id=sys;Password=Pwd@123;',
  '3': 'Server=127.0.0.1;Database=myDB;User Id=sa;Password=Pwd@123;',
  '4': 'Host=127.0.0.1;Database=myDB;Username=postgres;Password=Pwd@123;Port=5432;',
  '5': 'Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=127.0.0.1)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=myDB)));User Id=sys;Password=Pwd@123;',
  '6': 'Server=127.0.0.1;Database=myDB;Uid=root;Pwd=Pwd@123;Port=3306;',
  '7': 'Server=127.0.0.1;Database=myDB;Uid=root;Pwd=Pwd@123;Port=3306;',
  '8': 'Host=127.0.0.1;Database=myDB;Username=postgres;Password=Pwd@123;Port=5432;'
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
