// src/utils/connection.ts

// 解析连接字符串
export function parseConnectionString(type: string, connectionString: string) {
  const result: any = {};
  switch (type) {
    case '0': {
      const serverMatch = connectionString.match(/Server=(.*?);/i);
      const dbMatch = connectionString.match(/Database=(.*?);/i);
      const userIdMatch = connectionString.match(/UserID=(.*?);/i);
      const pwdMatch = connectionString.match(/Password=(.*?);/i);
      if (serverMatch) result.hostName = serverMatch[1].split(':')[0];
      if (serverMatch && serverMatch[1].includes(':')) {
        result.port = parseInt(serverMatch[1].split(':')[1], 10);
      }
      if (dbMatch) result.databases = dbMatch[1];
      if (userIdMatch) result.userName = userIdMatch[1];
      if (pwdMatch) result.password = pwdMatch[1];
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
      if (serverMatch) result.hostName = serverMatch[1];
      if (portMatch) result.port = parseInt(portMatch[1], 10);
      if (dbMatch) result.databases = dbMatch[1];
      if (uidMatch) result.userName = uidMatch[1];
      if (pwdMatch) result.password = pwdMatch[1];
      break;
    }
    case '2':
    case '5': {
      const hostMatch = connectionString.match(/HOST=(.*?)(\)|;)/i);
      const portMatch = connectionString.match(/PORT=(.*?)(\)|;)/i);
      const serviceNameMatch = connectionString.match(/SERVICE_NAME=(.*?)(\)|;)/i);
      const userIdMatch = connectionString.match(/User Id=(.*?);/i);
      const pwdMatch = connectionString.match(/Password=(.*?);/i);
      if (hostMatch) result.hostName = hostMatch[1];
      if (portMatch) result.port = parseInt(portMatch[1], 10);
      if (serviceNameMatch) result.databases = serviceNameMatch[1];
      if (userIdMatch) result.userName = userIdMatch[1];
      if (pwdMatch) result.password = pwdMatch[1];
      break;
    }
    case '3': {
      const serverMatch = connectionString.match(/Server=(.*?);/i);
      const dbMatch = connectionString.match(/Database=(.*?);/i);
      const userIdMatch = connectionString.match(/User Id=(.*?);/i);
      const pwdMatch = connectionString.match(/Password=(.*?);/i);
      if (serverMatch) result.hostName = serverMatch[1].split(',')[0];
      if (serverMatch && serverMatch[1].includes(',')) {
        result.port = parseInt(serverMatch[1].split(',')[1], 10);
      }
      if (dbMatch) result.databases = dbMatch[1];
      if (userIdMatch) result.userName = userIdMatch[1];
      if (pwdMatch) result.password = pwdMatch[1];
      break;
    }
    case '4':
    case '8': {
      const hostMatch = connectionString.match(/Host=(.*?);/i);
      const dbMatch = connectionString.match(/Database=(.*?);/i);
      const usernameMatch = connectionString.match(/Username=(.*?);/i);
      const pwdMatch = connectionString.match(/Password=(.*?);/i);
      const portMatch = connectionString.match(/Port=(.*?);/i);
      if (hostMatch) result.hostName = hostMatch[1];
      if (portMatch) result.port = parseInt(portMatch[1], 10);
      if (dbMatch) result.databases = dbMatch[1];
      if (usernameMatch) result.userName = usernameMatch[1];
      if (pwdMatch) result.password = pwdMatch[1];
      break;
    }
    default:
      break;
  }
  return result;
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
export function generateConnectionStringByType(databaseType: string, model: { connectionString: string }) {
  const template = connectionStringTemplates[databaseType];
  if (template) {
    model.connectionString = template;
  } else {
    model.connectionString = '';
  }
}
