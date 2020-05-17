/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Picker, StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import {I18nUtil} from '../modules/i18n';
import MyColor from '../modules/myColor';
import LocaleContext from '../modules/LocaleContext';

export default class LanguagePicker extends React.Component {
  static contextType = LocaleContext;

  constructor(props) {
    super(props);
  }

  generateItem(code) {
    const ISO6391 = require('iso-639-1');
    // const name = ISO6391.getName(code);
    const nativeName = ISO6391.getNativeName(code);
    // console.log(code, name, nativeName);
    return <Picker.Item key={code} label={nativeName} value={code} />;
  }

  getItem(code) {
    const ISO6391 = require('iso-639-1');
    const nativeName = ISO6391.getNativeName(code);
    return {value: code, label: nativeName};
  }

  showPickerSelect(locale, availableLanguages, setLocale = null) {
    const data = availableLanguages.map(code => this.getItem(code));
    return (
      <View
        style={{
          borderWidth: 0.5,
          borderRadius: 4,
          borderColor: MyColor.line3,
        }}>
        <RNPickerSelect
          placeholder={{}}
          style={pickerSelectStyles}
          value={locale}
          items={data}
          useNativeAndroidPickerStyle={true}
          pickerProps={{color: 'blue'}}
          onValueChange={(value, index) => {
            console.log('onValueChange', value, index);
            setLocale && setLocale(value);
          }}
        />
      </View>
    );
  }

  render() {
    const {t, locale, setLocale} = this.context;
    const availableLanguages = I18nUtil.getAvailableLanguages();
    console.log('LanguagePicker locale', locale);
    const languageLabel = t('Language.label');
    return (
      <View
        style={{
          marginLeft: 0,
          marginRight: 0,
        }}>
        <Text style={{color: MyColor.font5, marginTop: 10, marginBottom: 10}}>
          {languageLabel}
        </Text>
        {this.showPickerSelect(locale, availableLanguages, setLocale)}
      </View>
    );
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: MyColor.line3,
    borderRadius: 4,
    color: MyColor.font4,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: MyColor.line3,
    borderRadius: 2,
    color: MyColor.font4,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
