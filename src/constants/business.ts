import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  '1': 'page.manage.common.status.enable',
  '2': 'page.manage.common.status.disable'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  '1': 'page.manage.user.gender.male',
  '2': 'page.manage.user.gender.female'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.type.directory',
  '2': 'page.manage.menu.type.menu'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<Api.SystemManage.IconType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.iconType.iconify',
  '2': 'page.manage.menu.iconType.local'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);


export const databaseTypeRecord: Record<Api.ConnectionTypes.DatabaseType, App.I18n.I18nKey> = {
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

export const connectionModeRecord: Record<Api.ConnectionTypes.ConnectionMode, App.I18n.I18nKey> = {
  '0': 'page.connection.mode.custom',
  '1': 'page.connection.mode.connectionString'
};

export const connectionModeOptions = transformRecordToOption(connectionModeRecord);
