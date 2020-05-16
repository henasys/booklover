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
import Searcher from '../modules/searcher';
// import Permission from '../modules/permission';
import FileManager from '../modules/fileManager';

const IsbnUtil = require('isbn-utils');

const pickFile = async (setValue, setUri) => {
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
    setUri(res.uri);
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      throw err;
    }
  }
};

const search = (realm, isbn, callback, errorCallback, finalCallback) => {
  console.log('search', isbn);
  const book = Database.getBookByIsbn(realm, isbn, isbn);
  if (book) {
    const msg = `already added book ${isbn}`;
    console.log(msg);
    book._prechecked = true;
    callback(book);
    finalCallback();
    return;
  }
  const searcher = Searcher.getSearcher(realm);
  searcher
    .searchIsbn(isbn)
    .then(items => {
      console.log('searchIsbn items', items.length);
      items.forEach(item => {
        Searcher.postProcess(searcher, item)
          .then(mBook => {
            return Database.saveOrUpdateBook(realm, mBook);
          })
          .then(resultBook => {
            callback(resultBook);
          })
          .catch(e => {
            errorCallback(e);
          })
          .finally(() => {
            finalCallback();
          });
      });
    })
    .catch(e => {
      console.log('searchIsbn error', e);
      errorCallback(e);
      finalCallback();
    });
};

function ImportIsbn({navigation, route}) {
  const [realm, setRealm] = useState(null);
  const [isbnFile, setIsbnFile] = useState('');
  const [uri, setUri] = useState(null);
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
  const read = () => {
    let progressTotal = 0;
    const errorList = [];
    const precheckedList = [];
    const successList = [];
    FileManager.readFile(uri)
      .then(result => {
        console.log('FileManager.readFile result', result.length);
        if (!result || result.length === 0) {
          const msg = '파일 내용이 없거나 잘못된 형식입니다.';
          Toast.show(msg, Toast.LONG);
          return;
        }
        const list = result.trim().split('\n');
        console.log(list.length);
        const limit = list.length;
        const finalCallback = () => {
          progressTotal += 1;
          const progressValue = progressTotal / limit;
          console.log('progressTotal', progressTotal);
          console.log('progressValue', progressValue);
          console.log('successList', successList.length);
          console.log('precheckedList', precheckedList.length);
          console.log('errorList', errorList.length, errorList);
          setProgress(progressValue);
          if (progressTotal === limit) {
            const msg = `전체 ${list.length} 성공: ${
              successList.length
            }\n중복: ${precheckedList.length} 실패: ${errorList.length}`;
            Toast.show(msg, Toast.LONG);
            setTimeout(() => {
              setShowProgress(false);
            }, 5000);
          }
        };
        for (let index = 0; index < list.length; index++) {
          if (index > limit) {
            break;
          }
          const isbn = list[index];
          const checkIsbn = IsbnUtil.parse(isbn);
          if (!checkIsbn) {
            errorList.push(isbn);
            continue;
          }
          const callback = book => {
            if (book._prechecked) {
              precheckedList.push(isbn);
            } else {
              successList.push(isbn);
            }
          };
          const errorCallback = e => {
            errorList.push(isbn);
          };
          search(realm, isbn, callback, errorCallback, finalCallback);
        }
      })
      .catch(e => {
        console.log('FileManager.readFile error', e);
        const msg = '파일이 없거나 잘못된 형식입니다.\n다시 확인해주십시오.';
        Toast.show(msg, Toast.LONG);
        setShowProgress(false);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View>
          <Input
            onFocus={() => {
              console.log('onFocus Input');
              Keyboard.dismiss();
              pickFile(setIsbnFile, setUri);
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
              if (!uri) {
                const msg =
                  '아직 ISBN 파일을 선택하지 않았습니다.\n다시 확인해주십시오.';
                Toast.show(msg);
                return;
              }
              setShowProgress(true);
              setProgress(0);
              read();
            }}
          />
          {showProgress && (
            <View>
              <View style={styles.spacer} />
              <ProgressBar progress={progress} width={null} />
            </View>
          )}
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
