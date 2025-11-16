
import { transformRecordToOption, convertRecordToOption } from '@/utils/common';

export * from './common';

/** tasktype */
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


/** task status **/
export const taskStatusRecord: Record<Api.Task.TaskStatus, App.I18n.I18nKey> = {
  0: 'page.task.taskStatus.normal',
  1: 'page.task.taskStatus.draft',
  2: 'page.task.taskStatus.paused',
};
export const taskStatusOptions = convertRecordToOption(taskStatusRecord);

/** data handle script yes or no **/
export const dataHandleRecord: Record<Api.Common.YesOrNo, App.I18n.I18nKey> = {
  0: 'common.yesOrNo.no',
  1: 'common.yesOrNo.yes'
};
export const dataHandleOptions = convertRecordToOption(dataHandleRecord);

/* data object type */
export const dataObjectTypeRecord: Record<Api.Task.DataObjectType, App.I18n.I18nKey> = {
  'table': 'dropdownList.dataObjectType.table',
  'view': 'dropdownList.dataObjectType.view',
  'storedProcedure': 'dropdownList.dataObjectType.storedProcedure'
};
export const dataObjectTypeOptions = transformRecordToOption(dataObjectTypeRecord);


export const programmeLanguageOptions = [{ label: 'C#', value: '7000' }, { label: 'Python', value: '7001' }];
