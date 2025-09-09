import { transformRecordToOption, convertRecordToOption } from '@/utils/common';
/** common */
export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  0: 'common.status.enable',
  1: 'common.status.disable'
};
export const enableStatusOptions = convertRecordToOption(enableStatusRecord);

export const yesOrNoRecord: Record<Api.Common.YesOrNo, App.I18n.I18nKey> = {
  0: 'common.yesOrNo.no',
  1: 'common.yesOrNo.yes'
};
export const yesOrNoOptions = convertRecordToOption(yesOrNoRecord);

/** user */
export const userGenderRecord: Record<Api.SystemManage.Gender, App.I18n.I18nKey> = {
  '1': 'page.manage.user.gendertype.male',
  '0': 'page.manage.user.gendertype.female'
};
export const userGenderOptions = transformRecordToOption(userGenderRecord);

/** menu */
export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  '0': 'page.manage.menu.type.directory',
  '1': 'page.manage.menu.type.menu'
};
export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const permissionTypeRecord: Record<Api.SystemManage.PermissionType, App.I18n.I18nKey> = {
  '0': 'page.manage.permission.permissionType.button',
  '1': 'page.manage.permission.permissionType.column',
  '2': 'page.manage.permission.permissionType.option'
};
export const permissionTypeOptions = transformRecordToOption(permissionTypeRecord);

/** database */
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

export const connectionModeRecord: Record<Api.Connection.ConnectionMode, App.I18n.I18nKey> = {
  '0': 'page.connection.mode.custom',
  '1': 'page.connection.mode.connectionString'
};
export const connectionModeOptions = transformRecordToOption(connectionModeRecord);
