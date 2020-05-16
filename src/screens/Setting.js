/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Icon} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';

import Database from '../modules/database';
import MyAlert from '../views/alert';
import MyColor from '../modules/myColor';

const pickerApiSource = (realm, apiSource, setApiSource) => {
  const data = [
    {label: '네이버', value: Database.Setting.apiSourceType.NAVER},
    {label: '알라딘', value: Database.Setting.apiSourceType.ALADIN},
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
          Database.saveSetting(realm, value)
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
          <Text>검색 API</Text>
          <View style={styles.spacer} />
          {pickerApiSource(realm, apiSource, setApiSource)}
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Button
            title="데이터 백업, 복원"
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
            title=" ISBN 파일 데이터 추가"
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
            title="데이터베이스 삭제"
            type="outline"
            icon={<Icon name="delete" type="material-community" />}
            onPress={() => {
              const title = '삭제';
              const message = '데이터베이스 전체 데이터를 삭제하시겠습니까?';
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
