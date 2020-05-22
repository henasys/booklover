/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {Keyboard} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Icon, Input} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import DocumentPicker from 'react-native-document-picker';
import {Subject} from 'rxjs';

import Database from '../modules/database';
import Searcher from '../modules/searcher';
import FileManager from '../modules/fileManager';
import LocaleContext from '../modules/LocaleContext';

import ModalProgressBar from '../views/ModalProgressBar';

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

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const search = async (realm, isbn, callback, errorCallback, finalCallback) => {
  console.log('search', isbn);
  const searcher = Searcher.getSearcher(realm);
  if (searcher.isNaver) {
    console.log('waitting....');
    await sleep(2000);
  }
  searcher
    .searchIsbn(isbn)
    .then(items => {
      if (
        items === undefined ||
        items === null ||
        Array.isArray(items) === false ||
        items.length === 0
      ) {
        throw new Error(`searchIsbn items is null, ${isbn} ${items}`);
      }
      return items;
    })
    .then(items => {
      // console.log('searchIsbn items', items.length);
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
  const {t} = React.useContext(LocaleContext);
  const [realm, setRealm] = useState(null);
  const [isbnFile, setIsbnFile] = useState('');
  const [uri, setUri] = useState(null);
  const [progress, setProgress] = useState(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [processList, setProcessList] = useState([]);
  const [buttonPressed, setButtonPressed] = useState(false);
  useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
    });
    return () => {
      Database.close(realm);
    };
  }, []);
  const add = () => {
    console.log('add start');
    let progressTotal = 0;
    const errorList = [];
    const precheckedList = [];
    const successList = [];
    const limit = processList.length;
    const updateProgress = index => {
      progressTotal += 1;
      const progressValue = progressTotal / limit;
      // console.log('progressTotal', progressTotal, 'index', index);
      // console.log('progressValue', progressValue, 'index', index);
      setTimeout(() => {
        setProgress(progressValue);
      }, 0);
    };
    const updateMessage = () => {
      const msg = t('ImportIsbn.modalMessage', {
        total: processList.length,
        success: successList.length,
        duplicated: precheckedList.length,
        failure: errorList.length,
      });
      setTimeout(() => {
        setMessage(msg);
      }, 0);
      // console.log(msg.replace(/\n/g, ''));
    };
    const progressUpdater = new Subject();
    const subscriber = progressUpdater.subscribe({
      next: v => {
        updateProgress(v);
        updateMessage();
        // console.log('progressTotal at progressUpdater', progressTotal);
        if (progressTotal === limit) {
          subscriber.unsubscribe();
        }
      },
    });
    const searchList = [];
    processList.forEach((isbn, index) => {
      const finalCallback = () => {
        progressUpdater.next(index);
      };
      const checkIsbn = IsbnUtil.parse(isbn);
      if (!checkIsbn) {
        errorList.push(isbn);
        finalCallback();
      } else {
        const book = Database.getBookByIsbn(realm, isbn, isbn);
        if (book) {
          // const msg = `already added book ${isbn}`;
          // console.log(msg);
          precheckedList.push(isbn);
          finalCallback();
        } else {
          searchList.push(isbn);
        }
      }
    });
    searchList.forEach((isbn, index) => {
      const finalCallback = () => {
        progressUpdater.next(index);
      };
      const callback = book => {
        successList.push(isbn);
      };
      const errorCallback = e => {
        errorList.push(isbn);
      };
      search(realm, isbn, callback, errorCallback, finalCallback);
    });
  };
  const read = () => {
    FileManager.readFile(uri)
      .then(result => {
        console.log('FileManager.readFile result', result.length);
        if (!result || result.length === 0) {
          const msg = t('ImportIsbn.Toast.wrongFile');
          Toast.show(msg, Toast.LONG);
          return;
        }
        const list = result.trim().split('\n');
        console.log('list.length', list.length);
        const limit = list.length;
        setProcessList(limit === list.length ? list : list.slice(0, limit));
        setMessage(t('ImportIsbn.modalInitMessage', {total: limit}));
        setVisibleModal(true);
      })
      .catch(e => {
        console.log('FileManager.readFile error', e);
        const msg = t('ImportIsbn.Toast.wrongFile');
        Toast.show(msg, Toast.LONG);
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
            label={t('ImportIsbn.Input.isbn')}
            keyboardType="default"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={1}
          />
          <Button
            title={t('ImportIsbn.Button.isbn')}
            type="outline"
            icon={<Icon name="save" type="material" />}
            onPress={() => {
              if (!uri) {
                const msg = t('ImportIsbn.Toast.notReadyFile');
                Toast.show(msg);
                return;
              }
              setProgress(0);
              setButtonPressed(false);
              read();
            }}
          />
          <View style={styles.spacer} />
        </View>
      </ScrollView>
      <ModalProgressBar
        title={t('ImportIsbn.Button.isbn')}
        message={message}
        closeButtonTitle={t('Button.close')}
        processButtonTitle={
          buttonPressed ? t('Button.processing') : t('Button.add')
        }
        visible={visibleModal}
        setVisible={setVisibleModal}
        progress={progress}
        processCallback={() => {
          if (buttonPressed) {
            const msg = t('Misc.toastWaitButton');
            Toast.show(msg);
            return;
          }
          setButtonPressed(true);
          setTimeout(() => {
            add();
          }, 0);
        }}
        backButtonDisabled
        backdropDisabled
      />
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
