/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Icon} from 'react-native-elements';

import Database from '../modules/database';
import MyAlert from '../views/alert';

function Setting({navigation}) {
  const [realm, setRealm] = useState(null);
  const [] = useState('');
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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View>
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

export default Setting;
