import { transformRecordToOption, convertRecordToOption } from '@/utils/common';

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

// export const yesOrNoRecord: Record<CommonType.YesOrNo, App.I18n.I18nKey> = {
//   Y: 'common.yesOrNo.yes',
//   N: 'common.yesOrNo.no'
// };
// export const yesOrNoOptions = transformRecordToOption(yesOrNoRecord);
