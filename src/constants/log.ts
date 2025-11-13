import { transformRecordToOption, convertRecordToOption } from '@/utils/common';

export * from './common';

export const taskTypeRecord: Record<Api.Task.TaskType, App.I18n.I18nKey> = {
  '5000': 'dropdownList.taskType.database',
  '5001': 'dropdownList.taskType.webApi',
  '5002': 'dropdownList.taskType.industry'
};
export const taskTypeOptions = transformRecordToOption(taskTypeRecord);


/** log level **/
export const logLevelRecord: Record<Api.Log.LogLevel, App.I18n.I18nKey> = {
  0: 'dropdownList.logLevel.info',
  1: 'dropdownList.logLevel.warning',
  2: 'dropdownList.logLevel.error',
  3: 'dropdownList.logLevel.debug'
};
export const logLevelOptions = convertRecordToOption(logLevelRecord);
