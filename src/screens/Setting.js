/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Icon} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';

import Database from '../modules/database';
import MyColor from '../modules/myColor';
import LocaleContext from '../modules/LocaleContext';

import MyAlert from '../views/alert';
import LanguagePicker from '../views/LanguagePicker';

const pickerApiSource = (t, realm, apiSource, setApiSource) => {
  const labelByLocale = value => {
    return t('Setting.ApiSourceItem.' + value, {defaultValue: value});
  };
  const data = [
    {
      label: labelByLocale(Database.Setting.apiSourceType.NAVER),
      value: Database.Setting.apiSourceType.NAVER,
    },
    {
      label: labelByLocale(Database.Setting.apiSourceType.ALADIN),
      value: Database.Setting.apiSourceType.ALADIN,
    },
  ];
  return (
    <View
      style={{
        borderWidth: 0.5,
        borderRadius: 4,
        borderColor: MyColor.line1,
      }}>
      <RNPickerSelect
        placeholder={{}}
        style={pickerSelectStyles}
        value={apiSource}
        items={data}
        useNativeAndroidPickerStyle={true}
        pickerProps={{color: 'blue'}}
        onValueChange={(value, index) => {
          console.log('onValueChange', value, index);
          setApiSource(value);
          Database.saveSetting(realm, {apiSource: value})
            .then(setting => {
              console.log('saveSetting done', setting.apiSource);
            })
            .catch(e => {});
        }}
      />
    </View>
  );
};

function Setting({navigation}) {
  const [realm, setRealm] = useState(null);
  const [apiSource, setApiSource] = useState(null);
  const {t} = React.useContext(LocaleContext);
  useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
      // console.log('Database.open');
    });
    return () => {
      Database.close(realm);
      // console.log('Database.close');
    };
  }, []);
  useEffect(() => {
    if (!realm) {
      return;
    }
    const setting = Database.getSetting(realm);
    setApiSource(setting.apiSource);
  }, [realm]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View>
          <LanguagePicker />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Text>{t('Setting.apiSourceLabel')}</Text>
          <View style={styles.spacer} />
          {pickerApiSource(t, realm, apiSource, setApiSource)}
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Button
            title={t('Setting.Button.backup')}
            type="outline"
            icon={<Icon name="save" type="material" />}
            onPress={() => {
              navigation.navigate('Backup');
            }}
          />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Button
            title={t('Setting.Button.import')}
            type="outline"
            icon={<Icon name="barcode" type="material-community" />}
            onPress={() => {
              navigation.navigate('ImportIsbn');
            }}
          />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Button
            title={t('Setting.Button.delete')}
            type="outline"
            icon={<Icon name="delete" type="material-community" />}
            onPress={() => {
              const title = t('Setting.DeleteAlert.title');
              const message = t('Setting.DeleteAlert.message');
              const okCallback = async () => {
                await Database.clearAllDatabase();
              };
              const cancelCallback = () => {};
              MyAlert.showTwoButtonAlert(
                title,
                message,
                okCallback,
                cancelCallback,
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    flexDirection: 'row',
  },
  menuItem: {
    marginRight: 10,
  },
  contentContainer: {
    margin: 20,
  },
  textInputBox: {
    marginVertical: 5,
  },
  spacer: {
    paddingVertical: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: MyColor.line1,
    borderRadius: 4,
    color: MyColor.font2,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: MyColor.line1,
    borderRadius: 2,
    color: MyColor.font2,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Setting;
