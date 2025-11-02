import { transformRecordToOption } from '@/utils/common';

export * from './common';

/** user **/
export const userGenderRecord: Record<Api.SystemManage.Gender, App.I18n.I18nKey> = {
  '1': 'page.manage.user.gendertype.male',
  '0': 'page.manage.user.gendertype.female'
};
export const userGenderOptions = transformRecordToOption(userGenderRecord);

/** menu **/
export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  '0': 'page.manage.menu.type.directory',
  '1': 'page.manage.menu.type.menu'
};
export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

/** permission **/
export const permissionTypeRecord: Record<Api.SystemManage.PermissionType, App.I18n.I18nKey> = {
  '0': 'page.manage.permission.permissionType.button',
  '1': 'page.manage.permission.permissionType.column',
  '2': 'page.manage.permission.permissionType.option'
};
export const permissionTypeOptions = transformRecordToOption(permissionTypeRecord);
