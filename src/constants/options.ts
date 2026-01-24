import { transformRecordToOption, convertRecordToOption } from '@/utils/common';

//////////////////////////////////////////////////////////////////////////////////////////////////////
// common
/** yes or no **/
export const yesOrNoRecord: Record<Api.Common.YesOrNo, App.I18n.I18nKey> = {
  0: 'common.yesOrNo.no',
  1: 'common.yesOrNo.yes'
};
export const yesOrNoOptions = convertRecordToOption(yesOrNoRecord);

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  0: 'common.status.enable',
  1: 'common.status.disable'
};
export const enableStatusOptions = convertRecordToOption(enableStatusRecord);

/** boolean yes or no **/
/** yes or no **/
export const booleanYesOrNoRecord: Record<Api.Common.BooleanYesOrNo, App.I18n.I18nKey> = {
  'false': 'common.yesOrNo.no',
  'true': 'common.yesOrNo.yes'
};
export const booleanYesOrNoOptions = transformRecordToOption(booleanYesOrNoRecord);
/////////////////////////////////////////////////////////////////////////////////////////////////////
// database
export const databaseTypeRecord: Record<Api.Connection.DatabaseType, App.I18n.I18nKey> = {
  '0': 'dropdownList.databaseType.hana',
  '1': 'dropdownList.databaseType.mySql',
  '2': 'dropdownList.databaseType.oracle',
  '3': 'dropdownList.databaseType.sqlServer',
  '4': 'dropdownList.databaseType.postgreSQL',
  '5': 'dropdownList.databaseType.oceanBase',
  '6': 'dropdownList.databaseType.polarDB',
  '7': 'dropdownList.databaseType.goldenDB',
  '8': 'dropdownList.databaseType.openGauss'
};
export const databaseTypeOptions = transformRecordToOption(databaseTypeRecord);

// connection
export const connectionModeRecord: Record<Api.Connection.ConnectionMode, App.I18n.I18nKey> = {
  '0': 'page.connection.mode.custom',
  '1': 'page.connection.mode.connectionString'
};
export const connectionModeOptions = transformRecordToOption(connectionModeRecord);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// task
// tasktype
export const taskTypeRecord: Record<Api.Task.TaskType, App.I18n.I18nKey> = {
  '5000': 'dropdownList.taskType.database',
  '5001': 'dropdownList.taskType.webApi',
  '5002': 'dropdownList.taskType.industry'
};
export const taskTypeOptions = transformRecordToOption(taskTypeRecord);

/** runMode */
export const runModeRecord: Record<Api.Task.RunMode, App.I18n.I18nKey> = {
  '6000': 'dropdownList.runMode.manualOperation',
  '6001': 'dropdownList.runMode.everyDay',
  '6002': 'dropdownList.runMode.monthly',
  '6003': 'dropdownList.runMode.annually',
  '6004': 'dropdownList.runMode.timeInterval'
};
export const runModeOptions = transformRecordToOption(runModeRecord);

// task status
export const taskStatusRecord: Record<Api.Task.TaskStatus, App.I18n.I18nKey> = {
  0: 'page.task.taskStatus.normal',
  1: 'page.task.taskStatus.draft',
  2: 'page.task.taskStatus.paused',
};
export const taskStatusOptions = convertRecordToOption(taskStatusRecord);

// data handle script yes or no
export const dataHandleRecord: Record<Api.Common.YesOrNo, App.I18n.I18nKey> = {
  0: 'common.yesOrNo.no',
  1: 'common.yesOrNo.yes'
};
export const dataHandleOptions = convertRecordToOption(dataHandleRecord);

// data object type
export const dataObjectTypeRecord: Record<Api.Task.DataObjectType, App.I18n.I18nKey> = {
  'table': 'dropdownList.dataObjectType.table',
  'view': 'dropdownList.dataObjectType.view',
  'storedProcedure': 'dropdownList.dataObjectType.storedProcedure'
};
export const dataObjectTypeOptions = transformRecordToOption(dataObjectTypeRecord);
export const programmeLanguageOptions = [{ label: 'C#', value: '7000' }, { label: 'Python', value: '7001' }];
/////////////////////////////////////////////////////////////////////////////////////////////////////
// message
export const messageTypeRecord: Record<Api.Message.MessageType, App.I18n.I18nKey> = {
  0: 'dropdownList.messageType.weCom',
  1: 'dropdownList.messageType.dingTalk',
  2: 'dropdownList.messageType.textMessage',
  3: 'dropdownList.messageType.email',
};
export const messageTypeOptions = convertRecordToOption(messageTypeRecord);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// log
// log level
export const logLevelRecord: Record<Api.Log.LogLevel, App.I18n.I18nKey> = {
  0: 'dropdownList.logLevel.info',
  1: 'dropdownList.logLevel.success',
  2: 'dropdownList.logLevel.warning',
  3: 'dropdownList.logLevel.failure',
  4: 'dropdownList.logLevel.debug'
};
export const logLevelOptions = convertRecordToOption(logLevelRecord);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// manage
// user
export const userGenderRecord: Record<Api.SystemManage.Gender, App.I18n.I18nKey> = {
  '1': 'page.manage.user.gendertype.male',
  '0': 'page.manage.user.gendertype.female'
};
export const userGenderOptions = transformRecordToOption(userGenderRecord);

// menu
export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  '0': 'page.manage.menu.type.directory',
  '1': 'page.manage.menu.type.menu'
};
export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

// permission
export const permissionTypeRecord: Record<Api.SystemManage.PermissionType, App.I18n.I18nKey> = {
  '0': 'page.manage.permission.permissionType.button',
  '1': 'page.manage.permission.permissionType.column',
  '2': 'page.manage.permission.permissionType.option'
};
export const permissionTypeOptions = transformRecordToOption(permissionTypeRecord);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// token
export const interfaceTypeRecord: Record<Api.Task.InterfaceType, App.I18n.I18nKey> = {
  '8000': 'dropdownList.requestType.call',
  '8001': 'dropdownList.requestType.pull',
  '8002': 'dropdownList.requestType.pushSingle',
  '8003': 'dropdownList.requestType.pushBatch'
};
export const interfaceTypeOptions = transformRecordToOption(interfaceTypeRecord);

export const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' }
];

export const paramTypeOptions = [
  { label: 'String', value: 0 },
  { label: 'Integer', value: 1 },
  { label: 'Boolean', value: 2 },
  { label: 'Number', value: 3 },
  { label: 'Object', value: 4 },
  { label: 'Array', value: 5 },
  { label: 'Any', value: 6 }
];

export const bodyTypeOptions = [
  { label: 'None', value: 0 },
  { label: 'Json', value: 1 },
  { label: 'Xml', value: 2 },
  { label: 'Html', value: 3 },
  { label: 'Text', value: 4 },
  { label: 'FormData', value: 5 },
  { label: 'x-www-form-urlencoded', value: 6 },
  { label: 'Binary', value: 7 }
];

export const customItemTypeOptions = [
  { label: 'String', value: 0 },
  { label: 'Integer', value: 1 },
  { label: 'Boolean', value: 2 },
  { label: 'Number', value: 3 },
];

export const sendTypeOptions = [
  { label: 'Send Credentials in Body', value: 0 },
  { label: 'Send Credentials as Basic Auth', value: 1 }
];

export const algorithmOptions = [
  { value: 'HS256' },
  { value: 'HS384' },
  { value: 'HS512' },
  { value: 'RS256' },
  { value: 'RS384' },
  { value: 'RS512' },
  { value: 'ES256' },
  { value: 'ES384' },
  { value: 'ES512' },
  { value: 'PS256' },
  { value: 'PS384' },
  { value: 'PS512' }
];

export const locationOptions = [
  { label: 'Header', value: 0 },
  { label: 'Query', value: 1 },
];

export const tokenRetrievalTypeOptions = [
  { label: 'TokenPath', value: 0 },
  { label: 'TokenCode', value: 1 },
];

export const authTypeOptions = [
  { label: 'Custom', value: 0},
  { label: 'API Key', value: 1 },
  { label: 'Basic Auth', value: 2 },
  { label: 'Client Credentials (OAuth2)', value: 3 },
  { label: 'Password Credentials (OAuth2)', value: 4 },
  { label: 'JwtBearer', value: 5 },
  { label: 'Ntlm', value: 6 }
]


export const paramNameOptions = [
  { value: 'Accept' },
  { value: 'Accept-Charset' },
  { value: 'Accept-Encoding' },
  { value: 'Accept-Language' },
  { value: 'Access-Control-Request-Headers' },
  { value: 'Access-Control-Request-Method' },
  { value: 'Authorization' },
  { value: 'Cache-Control' },
  { value: 'Content-MD5' },
  { value: 'Content-Length' },
  { value: 'Content-Transfer-Encoding' },
  { value: 'Cookie' },
  { value: 'Date' },
  { value: 'Expect' },
  { value: 'From' },
  { value: 'Host' },
  { value: 'If-Match' },
  { value: 'If-Modified-Since' },
  { value: 'If-Range' },
  { value: 'If-Unmodified-Since' },
  { value: 'Keep-Alive' },
  { value: 'Max-Forwards' },
  { value: 'Origin' },
  { value: 'Pragma' },
  { value: 'Proxy-Authenticate' },
  { value: 'Range' },
  { value: 'Referer' },
  { value: 'TE' },
  { value: 'Trailer' },
  { value: 'Transfer-Encoding' },
  { value: 'Upgrade' },
  { value: 'User-Agent' },
  { value: 'Via' },
  { value: 'Warning' },
  { value: 'X-Requested-With' },
  { value: 'X-Do-Not-Track' },
  { value: 'DNT' },
  { value: 'x-api-key' },
  { value: 'Connection' },
];

export const contentTypeOptions = [
  { value: 'application/json' },
  { value: 'application/xml' },
  { value: 'application/x-www-form-urlencoded' },
  { value: 'multipart/form-data' },
  { value: 'text/plain' },
  { value: 'text/html' },
  { value: 'text/css' },
  { value: 'text/javascript' },
  { value: 'application/javascript' },
  { value: 'application/pdf' },
  { value: 'application/zip' },
  { value: 'image/jpeg' },
  { value: 'image/png' },
  { value: 'image/gif' },
  { value: 'audio/mpeg' },
  { value: 'video/mp4' },
  { value: 'application/octet-stream' },
  { value: 'application/wps-office.wps' },           // WPS 文字文件
  { value: 'application/wps-office.wpt' },           // WPS 文字模板
  { value: 'application/wps-office.et' },            // WPS 表格文件
  { value: 'application/wps-office.ett' },           // WPS 表格模板
  { value: 'application/wps-office.dps' },           // WPS 演示文件
  { value: 'application/wps-office.dpt' },           // WPS 演示模板
  { value: 'application/vnd.ms-works' },             // MS Works
  { value: 'application/msword' },
  { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { value: 'application/vnd.ms-excel' },
  { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { value: 'application/vnd.ms-powerpoint' },
  { value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  { value: 'text/csv' },
  { value: 'image/svg+xml' },
  { value: 'application/x-tar' },
  { value: 'application/gzip' }
];
