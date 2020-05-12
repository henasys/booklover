/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Icon, Input} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import ProgressBar from 'react-native-progress/Bar';

import Database from '../modules/database';
import Permission from '../modules/permission';
import FileManager from '../modules/fileManager';
import Bundle from '../modules/bundle';
import MyAlert from '../views/alert';

const write = (fileName, content) => {
  const encoding = Bundle.getEncoding(fileName);
  FileManager.writeBookLoverPath(fileName, content, encoding)
    .then(() => {
      console.log('FileManager.writeBookLoverPath done', fileName);
      const folder = FileManager.getBookLoverFolder();
      const msg = `백업 파일 저장 완료: \n${folder}/${fileName}`;
      Toast.show(msg);
    })
    .catch(e => {
      console.log('FileManager.writeBookLoverPath error', e);
      const msg = `백업 파일 저장 실패 ${fileName} ${e}`;
      Toast.show(msg);
    });
};

function Setting({navigation, route}) {
  const [realm, setRealm] = useState(null);
  const [fileName, setFileName] = useState('booklover-backup.xlsx');
  const [fileNameError, setFileNameError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
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
  const read = () => {
    const encoding = Bundle.getEncoding(fileName);
    let progressTotal = 0;
    FileManager.readBookLoverPath(fileName, encoding)
      .then(result => {
        const list = Bundle.parseBookList(fileName, result);
        list.forEach((book, index) => {
          Database.saveOrUpdateBook(realm, book)
            .then(resultBook => {
              const msg = `데이터 복원 성공: ${resultBook.title}`;
              console.log(msg);
            })
            .catch(e => {
              const msg = `데이터 복원 실패: ${e}`;
              Toast.show(msg);
            })
            .finally(() => {
              const progressValue = 1 / list.length;
              progressTotal += progressValue;
              console.log('progressTotal', progressTotal);
              setProgress(progressTotal);
              if (progressTotal >= 1) {
                setTimeout(() => {
                  setShowProgress(false);
                }, 5000);
              }
            });
        });
      })
      .catch(e => {
        console.log('FileManager.readBookLoverPath error', e);
      });
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
              const content = Bundle.bundleBookList(realm, fileName);
              Permission.checkPermissionForWriteExternalStorage(() => {
                write(fileName, content);
              });
            }}
          />
          <View style={styles.spacer} />
          <Button
            title="데이터 복원"
            type="outline"
            icon={<Icon name="backup-restore" type="material-community" />}
            onPress={() => {
              setShowProgress(true);
              setProgress(0);
              Permission.checkPermissionForReadExternalStorage(() => {
                read(realm, fileName, progress, setProgress);
              });
            }}
          />
          {showProgress && (
            <View>
              <View style={styles.spacer} />
              <ProgressBar progress={progress} width={null} />
            </View>
          )}
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
