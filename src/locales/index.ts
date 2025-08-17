import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import { localStg } from '@/utils/storage';
import messages from './locale';

const i18n = createI18n({
  locale: localStg.get('lang') || 'zh-CN',
  fallbackLocale: 'en',
  messages,
  legacy: false
});

/**
 * Setup plugin i18n
 *
 * @param app
 */
export function setupI18n(app: App) {
  app.use(i18n);
    // 监听语言变化，同步更新类名
  i18n.global.locale.subscribe((newLocale, oldLocale) => {
    if (oldLocale) {
      updateLangClass(oldLocale, newLocale);
    }
  });
}

export const $t = i18n.global.t as App.I18n.$T;

export function setLocale(locale: App.I18n.LangType) {
  i18n.global.locale.value = locale;
}

// 更新语言类名（移除旧类名，添加新类名）
const updateLangClass = (oldLang: string, newLang: string) => {
  const html = document.documentElement;
  html.classList.remove(`lang-${formatLangClass(oldLang)}`);
  html.classList.add(`lang-${formatLangClass(newLang)}`);
};
