/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {Keyboard} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Icon, Input} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import ProgressBar from 'react-native-progress/Bar';
import DocumentPicker from 'react-native-document-picker';

import Database from '../modules/database';
// import Permission from '../modules/permission';
import FileManager from '../modules/fileManager';
import MyAlert from '../views/alert';

const pickFile = async setValue => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.plainText],
    });
    console.log(
      res.uri,
      res.type, // mime type
      res.name,
      res.size,
    );
    setValue(res.name);
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      throw err;
    }
  }
};

function ImportIsbn({navigation, route}) {
  const [realm, setRealm] = useState(null);
  const [isbnFile, setIsbnFile] = useState('');
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
          <Input
            onFocus={() => {
              console.log('onFocus Input');
              Keyboard.dismiss();
              pickFile(setIsbnFile);
            }}
            onBlur={() => {
              console.log('onBlur Input');
            }}
            onKeyPress={() => {
              console.log('onKeyPress Input');
            }}
            onPress={() => {
              console.log('onPress Input');
            }}
            disabledInputStyle={{color: 'black', opacity: 1}}
            containerStyle={styles.textInputBox}
            labelStyle={{fontSize: 14}}
            defaultValue={isbnFile}
            label={'ISBN 파일'}
            keyboardType="default"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={1}
          />
          <Button
            title="ISBN 검색 추가"
            type="outline"
            icon={<Icon name="save" type="material" />}
            onPress={() => {
              //
            }}
          />
          <View style={styles.spacer} />
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

export default ImportIsbn;
