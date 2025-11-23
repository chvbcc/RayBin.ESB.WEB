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
  { label: 'None', value: 'None' },
  { label: 'Json', value: 'Json' },
  { label: 'Xml', value: 'Xml' },
  { label: 'Html', value: 'Html' },
  { label: 'Text', value: 'Text' },
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
