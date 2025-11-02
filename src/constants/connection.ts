import { transformRecordToOption } from '@/utils/common';

/** database **/
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

/** connection **/
export const connectionModeRecord: Record<Api.Connection.ConnectionMode, App.I18n.I18nKey> = {
  '0': 'page.connection.mode.custom',
  '1': 'page.connection.mode.connectionString'
};
export const connectionModeOptions = transformRecordToOption(connectionModeRecord);
