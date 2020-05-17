import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import en from '../locale/en';
import ko from '../locale/ko';

const DEFAULT_LANGUAGE = 'en';
const translations = {en, ko};

export const I18nUtil = () => {};

I18nUtil.getDefaultLanguage = () => {
  return DEFAULT_LANGUAGE;
};

I18nUtil.getAvailableLanguages = () => {
  return Object.keys(translations);
};

I18nUtil.currentLocale = () => {
  return I18n.currentLocale();
};

I18nUtil.getBestAvailableLanguage = () => {
  const fallback = {languageTag: DEFAULT_LANGUAGE, isRTL: false};
  const {languageTag, isRTL} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translations)) || fallback;
  return {languageTag, isRTL};
};

I18nUtil.setLanguage = languageTag => {
  I18n.translations = translations;
  I18n.fallbacks = true;
  I18n.locale = languageTag;
};

I18nUtil.addEventListener = handler => {
  RNLocalize.addEventListener('change', handler);
};

I18nUtil.removeEventListener = handler => {
  RNLocalize.removeEventListener('change', handler);
};

I18nUtil.getLocales = () => {
  return RNLocalize.getLocales();
};

export default I18n;
