import { $t } from '@/locales';
import dayjs from 'dayjs';

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

export function convertDateTime(dateTime: string | undefined | null ) {
  if (!dateTime || dateTime === '0001-01-01T00:00:00' || dateTime === '1900-01-01T00:00:00') {
    return undefined;
  }
  const day = dayjs(dateTime);
  return day.format('YYYY-MM-DDTHH:mm:ss');
}

export function getPromptMessage(query: any, result: string)
{
  if (query && (query.hasOwnProperty('id') || query == 'edit')) {
    const message =  result === "Success" ? 'common.updateSuccess' : 'common.updateFailed';
    return $t(message as App.I18n.I18nKey)
  } else {
    const message =  result === "Success" ? 'common.addSuccess' : 'common.addFailed';
    return $t(message as App.I18n.I18nKey)
  }
}
