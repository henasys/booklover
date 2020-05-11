/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Icon, Input} from 'react-native-elements';
import Toast from 'react-native-simple-toast';

import Database from '../modules/database';
import Permission from '../modules/permission';
import FileManager from '../modules/fileManager';

function Setting({navigation, route}) {
  const [realm, setRealm] = useState(null);
  const [fileName, setFileName] = useState('booklover-backup.json');
  const [fileNameError, setFileNameError] = useState(null);
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
  const onEndEditingFileName = () => {
    if (!fileName || fileName.length === 0) {
      setFileNameError('백업 파일 이름이 비어있습니다.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View>
          <Input
            containerStyle={styles.textInputBox}
            labelStyle={{fontSize: 14}}
            onChangeText={setFileName}
            onEndEditing={onEndEditingFileName}
            defaultValue={fileName}
            errorMessage={fileNameError}
            label={'백업 파일'}
            keyboardType="default"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={1}
          />
          <Button
            title="데이터 백업"
            type="outline"
            icon={<Icon name="save" type="material" />}
            onPress={() => {
              const list = Database.getBookList(realm).map(b =>
                Database.bookToObject(b),
              );
              const content = JSON.stringify(list);
              console.log('content', content);
              Permission.checkPermissionForWriteExternalStorage(() => {
                FileManager.writeBookLoverPath(fileName, content)
                  .then(() => {
                    console.log(
                      'FileManager.writeBookLoverPath done',
                      fileName,
                    );
                    const folder = FileManager.getBookLoverFolder();
                    const msg = `백업 파일 저장 완료: \n${folder}/${fileName}`;
                    Toast.show(msg);
                  })
                  .catch(e => {
                    console.log('FileManager.writeBookLoverPath error', e);
                    const msg = `백업 파일 저장 실패 ${fileName} ${e}`;
                    Toast.show(msg);
                  });
              });
            }}
          />
          <View style={styles.spacer} />
          <Button
            title="데이터 복원"
            type="outline"
            icon={<Icon name="backup-restore" type="material-community" />}
            onPress={() => {
              Permission.checkPermissionForReadExternalStorage(() => {
                FileManager.readDirBookLoverPath()
                  .then(result => {
                    console.log(
                      'FileManager.readDirBookLoverPath result',
                      result,
                    );
                  })
                  .catch(e => {
                    console.log('FileManager.readDirBookLoverPath error', e);
                  });
              });
            }}
          />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Button
            title="데이터베이스 삭제"
            type="outline"
            icon={<Icon name="delete" type="material-community" />}
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
