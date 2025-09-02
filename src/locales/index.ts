import { watch, type App } from 'vue';
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
  // 初始化语言类名
  const initialLocale = i18n.global.locale.value;
  updateLangClass('', initialLocale);

  watch(() => i18n.global.locale.value,
    (newLocale, oldLocale) => {
      if (oldLocale) {
        updateLangClass(oldLocale, newLocale);
      }
    }
  );
}

export function language(): string {
  return i18n.global.locale.value;
}

export const $t = i18n.global.t as App.I18n.$T;

export function setLocale(locale: App.I18n.LangType) {
  i18n.global.locale.value = locale;
}

// 更新语言类名（移除旧类名，添加新类名）
const updateLangClass = (oldLang: string, newLang: string) => {
  const html = document.documentElement;
  if (oldLang) {
    html.classList.remove(`lang-${oldLang.toLowerCase()}`);
  }
  html.classList.add(`lang-${newLang.toLowerCase()}`);
};
