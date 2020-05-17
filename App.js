/* eslint-disable react-hooks/exhaustive-deps */
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/ko';

import Navigator from './src/modules/navigator';
import MyStack from './src/screens/MyStack';
import I18n from './src/modules/i18n';
import I18nService from './src/modules/i18nService';
import Database from './src/modules/database';
import {LocaleProvider} from './src/modules/LocaleContext';

if (!__DEV__) {
  console.log = () => {};
  // console.warn = () => {};
  // console.error = () => {};
}

const initMomentLocale = (locale = null) => {
  const currentLocale = locale ? locale : I18nService.getLanguage();
  console.log('I18n.currentLocale', currentLocale);
  const momentLocale = moment.locale(currentLocale);
  console.log('moment locale', momentLocale);
};

function App() {
  const [realm, setRealm] = useState(null);
  const [locale, setLocale] = useState(null);
  useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
    });
    return () => {
      Database.close(realm);
    };
  }, []);
  useEffect(() => {
    if (!realm) {
      return;
    }
    console.log(realm.schemaVersion);
    I18nService.initializeLanguage(realm);
    setLocale(I18nService.getLanguage());
    initLocale();
    return () => {
      removeLocaleListeners();
    };
  }, [realm]);
  const setAppLocale = newLocale => {
    console.log('setAppLocale', newLocale);
    setLocale(newLocale);
    I18nService.setLanguage(realm, newLocale);
    initMomentLocale(newLocale);
  };
  const t = (scope, options) => {
    return I18n.t(scope, {locale: locale, ...options});
  };
  const localeProps = {
    t: t,
    locale: locale,
    setLocale: setAppLocale,
  };
  const initLocale = () => {
    I18nService.addEventListener(handleLocalizationChange);
    initMomentLocale();
  };
  const removeLocaleListeners = () => {
    I18nService.removeEventListener(handleLocalizationChange);
  };
  const handleLocalizationChange = () => {
    console.log('handleLocalizationChange');
    I18nService.initializeLanguage(realm);
    setAppLocale(I18nService.getLanguage());
  };
  return (
    <LocaleProvider value={localeProps}>
      <SafeAreaProvider>
        <NavigationContainer
          ref={Navigator.navigationRef}
          onStateChange={state => {
            // console.log('New state is', state);
            const currentRouteName = Navigator.getActiveRouteName(state);
            Navigator.routeNameRef.current = currentRouteName;
            // console.log('currentRouteName', currentRouteName);
          }}>
          <MyStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </LocaleProvider>
  );
}

export default App;
