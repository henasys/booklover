import {I18nUtil} from './i18n';
import Database from '../modules/database';

const defaultLanguage = I18nUtil.getDefaultLanguage();
const availableLanguages = I18nUtil.getAvailableLanguages();

const addEventListener = handler => {
  I18nUtil.addEventListener(handler);
};

const removeEventListener = handler => {
  I18nUtil.removeEventListener(handler);
};

const getLanguage = () => {
  return I18nUtil.currentLocale();
};

const setLanguage = (realm, language) => {
  console.log('I18nService setLanguage', language);
  I18nUtil.setLanguage(language);
  const currentLanguage = Database.getSetting(realm).language;
  if (currentLanguage === language) {
    console.log('the same language, no need to update');
    return;
  }
  Database.saveSetting(realm, {language})
    .then(setting => {
      console.log('Database.saveSetting done', setting.language);
    })
    .catch(e => {
      console.log(e);
    });
};

const initializeLanguage = realm => {
  const currentLanguage = Database.getSetting(realm).language;
  console.log('I18nService initializeAppLanguage', currentLanguage);

  if (currentLanguage) {
    setLanguage(realm, currentLanguage);
  } else {
    const {languageTag} = I18nUtil.getBestAvailableLanguage();
    console.log('I18nService getBestAvailableLanguage', languageTag);
    setLanguage(realm, languageTag);
  }
};

export default {
  defaultLanguage,
  availableLanguages,
  setLanguage,
  getLanguage,
  initializeLanguage,
  addEventListener,
  removeEventListener,
};
