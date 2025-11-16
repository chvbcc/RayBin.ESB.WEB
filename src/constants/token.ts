import { transformRecordToOption } from '@/utils/common';

export * from './common';

export const requestTypeRecord: Record<Api.Task.RequestType, App.I18n.I18nKey> = {
  '8000': 'dropdownList.requestType.call',
  '8001': 'dropdownList.requestType.pull',
  '8002': 'dropdownList.requestType.push'
};
export const requestTypeOptions = transformRecordToOption(requestTypeRecord);

export const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' }
];

export const paramTypeOptions = [
  { label: 'String', value: 'String' },
  { label: 'Integer', value: 'Integer' },
  { label: 'Boolean', value: 'Boolean' },
  { label: 'Number', value: 'Number' },
  { label: 'Array', value: 'Array' }
];

export const bodyTypeOptions = [
  { label: 'None', value: 'String' },
  { label: 'Json', value: 'Integer' },
  { label: 'Xml', value: 'Boolean' },
  { label: 'Text', value: 'Number' },
  { label: 'x-www-form-urlencoded', value: 'x-www-form-urlencoded' },
  { label: 'FormData', value: 'FormData' },
  { label: 'Binary', value: 'Binary' }
];

export const authTypeOptions = [
  { label: 'None', value: 'None' },
  { label: 'ApiKey', value: 'ApiKey' },
  { label: 'Basic', value: 'Basic' },
  { label: 'Bearer', value: 'Bearer' },
  { label: 'OAuth2', value: 'OAuth2' },
  { label: 'JwtBearer', value: 'JwtBearer' },
  { label: 'Ntlm', value: 'Ntlm' }
]
