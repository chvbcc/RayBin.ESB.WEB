import { $t, language } from '@/locales';
/**
 * Transform record to option
 *
 * @example
 *   ```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param record
 */
export function transformRecordToOption<T extends Record<string, string>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    value,
    label
  })) as CommonType.Option<keyof T>[];
}

export function convertRecordToOption<T extends Record<number, string>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    value: Number(value),
    label
  })) as CommonType.Option<keyof T>[];
}

/**
 * Translate options
 *
 * @param options
 */
export function translateOptions(options: CommonType.Option<string>[]) {
  return options.map(option => ({
    ...option,
    label: $t(option.label as App.I18n.I18nKey)
  }));
}

export function convertOptions(options: CommonType.Option<number>[]) {
  return options.map(option => ({
    ...option,
    label: $t(option.label as App.I18n.I18nKey)
  }));
}

/**
 * Toggle html class
 *
 * @param className
 */
export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className);
  }

  function remove() {
    document.documentElement.classList.remove(className);
  }

  return {
    add,
    remove
  };
}

export function convertDateTime(dateTime: string | undefined) : string | undefined {
  if (!dateTime || dateTime === '0001-01-01T00:00:00' || dateTime === '1900-01-01T00:00:00') {
    return undefined;
  }
}


export function getPromptMessage(query: any, result: string) : string {
  if (query && (query.hasOwnProperty('id') || query == 'edit')) {
    const message =  result === "Success" ? 'common.updateSuccess' : 'common.updateFailed';
    return $t(message as App.I18n.I18nKey)
  } else {
    const message =  result === "Success" ? 'common.addSuccess' : 'common.addFailed';
    return $t(message as App.I18n.I18nKey)
  }
}

export function isJson(input: unknown): boolean {
  if (typeof input !== 'string') return false;
  const value = input.trim();
  try {
    const v = JSON.parse(value);
    return typeof v === 'object' && v !== null;
  } catch {
    return false;
  }
}

export function isUrl(input: unknown): boolean {
  if (typeof input !== 'string') return false;
  const str = input.trim();
  if (!str) return false;
  try {
    const u = new URL(str);
    return ['http:', 'https:'].includes(u.protocol);
  } catch {
    return false;
  }
}

export function formatRunTime(input: string, runMode: Api.Task.RunMode, runWeek: Api.Task.RunWeek): string {
  //input format: 2024-01-01 12:00:00
  const lang = language();
  const [datePart, timePart] = input.split(' ');
  if (!datePart) return '';
  const [, monthStr, dayStr] = datePart.split('-');
  switch (runMode) {
    case '6001':
      return timePart || '00:00:00';
    case '6002':
      return convertWeek(runWeek, lang) + " " + timePart;
    case '6003':
      if (!dayStr) return '';
      return convertDay(dayStr, lang) + " " + timePart;
    case '6004':
      if (!monthStr || !dayStr) return '';
      return convertMonth(monthStr, lang) + " " + convertDay(dayStr, lang) + " " + timePart;
    case '6005':
      return input;
  }
  return input;
}

export function getWeek(): Api.Task.RunWeek {
  // 获取当前是星期几，返回1-7
  const day = new Date().getDay();
  return day === 0 ? 7 : day as Api.Task.RunWeek;
}

function convertDay(num: number | string, language: string): string {
  const n = Number(num);
  if (isNaN(n) || n <= 0 ||n > 31|| !Number.isInteger(n)) return '';
  if (language !== 'en-US') return `${n}日`;
  // 2. 规则：11/12/13 固定返回 th
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return `${n}th`;
  }
  // 3. 其他数字按最后一位匹配后缀
  const mod10 = n % 10;
  switch (mod10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

function convertWeek(num: number | string, language: string): string {
  const n = Number(num);
  if (isNaN(n) || n <= 0 || !Number.isInteger(n)) return '';
  const mod10 = n % 10;
  switch (mod10) {
    case 1: return language === 'en-US' ? 'Monday' : '星期一';
    case 2: return language === 'en-US' ? 'Tuesday' : '星期二';
    case 3: return language === 'en-US' ? 'Wednesday' : '星期三';
    case 4: return language === 'en-US' ? 'Thursday' : '星期四';
    case 5: return language === 'en-US' ? 'Friday' : '星期五';
    case 6: return language === 'en-US' ? 'Saturday' : '星期六';
    case 7: return language === 'en-US' ? 'Sunday' : '星期日';
    default: return '';
  }
}

function convertMonth(num: number | string, language: string): string {
  const n = Number(num);
  if (isNaN(n) || n <= 0 || !Number.isInteger(n)) return '';
  const mod10 = n % 10;
  switch (mod10) {
    case 1: return language === 'en-US' ? 'January' : '一月';
    case 2: return language === 'en-US' ? 'February' : '二月';
    case 3: return language === 'en-US' ? 'March' : '三月';
    case 4: return language === 'en-US' ? 'April' : '四月';
    case 5: return language === 'en-US' ? 'May' : '五月';
    case 6: return language === 'en-US' ? 'June' : '六月';
    case 7: return language === 'en-US' ? 'July' : '七月';
    case 8: return language === 'en-US' ? 'August' : '八月';
    case 9: return language === 'en-US' ? 'September' : '九月';
    case 10: return language === 'en-US' ? 'October' : '十月';
    case 11: return language === 'en-US' ? 'November' : '十一月';
    case 12: return language === 'en-US' ? 'December' : '十二月';
    default: return '';
  }
}


