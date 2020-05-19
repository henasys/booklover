/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {Keyboard} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Icon, Input} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import DocumentPicker from 'react-native-document-picker';
import * as mime from 'react-native-mime-types';

import Database from '../modules/database';
import FileManager from '../modules/fileManager';
import Bundle from '../modules/bundle';
import LocaleContext from '../modules/LocaleContext';

import ModalProgressBar from '../views/ModalProgressBar';

const write = (t, fileName, content) => {
  if (!fileName) {
    const msg = t('Backup.fileNameEmptyError');
    Toast.show(msg);
    return;
  }
  const encoding = Bundle.getEncoding(fileName);
  FileManager.writeBookLoverPath(fileName, content, encoding)
    .then(() => {
      console.log('FileManager.writeBookLoverPath done', fileName);
      const folder = FileManager.getBookLoverFolder();
      const msg = `${t('Backup.Toast.writeOk')}: \n${folder}/${fileName}`;
      Toast.show(msg);
    })
    .catch(e => {
      console.log('FileManager.writeBookLoverPath error', e);
      const msg = `${t('Backup.Toast.writeFail')}: ${fileName} ${e}`;
      Toast.show(msg);
    });
};

const pickFile = async (setValue, setUri) => {
  try {
    const res = await DocumentPicker.pick({
      type: [mime.lookup('xlsx'), mime.lookup('xls')],
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

function Backup() {
  const {t} = React.useContext(LocaleContext);
  const [realm, setRealm] = useState(null);
  const [fileName, setFileName] = useState('booklover-backup.xlsx');
  const [fileNameError, setFileNameError] = useState(null);
  const [restoreFileName, setRestoreFileName] = useState(null);
  const [uri, setUri] = useState(null);
  const [progress, setProgress] = useState(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [processList, setProcessList] = useState([]);
  useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
    });
    return () => {
      Database.close(realm);
    };
  }, []);
  const onEndEditingFileName = () => {
    if (!fileName || fileName.length === 0) {
      setFileNameError(t('Backup.fileNameEmptyError'));
    }
  };
  const restore = () => {
    let progressTotal = 0;
    const errorList = [];
    const successList = [];
    const limit = processList.length;
    const finalCallback = () => {
      progressTotal += 1;
      const progressValue = progressTotal / limit;
      if (progressTotal % 10 === 0) {
        setTimeout(() => {
          setProgress(progressValue);
        }, 100);
      }
      if (progressTotal === limit) {
        setTimeout(() => {
          setProgress(progressValue);
        }, 500);
        const msg = t('Backup.modalMessage', {
          total: processList.length,
          success: successList.length,
          failure: errorList.length,
        });
        setMessage(msg);
        console.log(msg.replace(/\n/g, ''));
      }
    };
    if (limit === 0) {
      setProgress(1);
      return;
    }
    processList.forEach(book => {
      Database.saveOrUpdateBook(realm, book)
        .then(resultBook => {
          if (resultBook) {
            successList.push(book.title);
            const msg = `restore done: ${resultBook.title}`;
            console.log(msg);
          }
        })
        .catch(e => {
          errorList.push(book.title);
          console.log('restore error', e);
        })
        .finally(() => {
          finalCallback();
        });
    });
  };
  const read = () => {
    const encoding = Bundle.getEncoding(restoreFileName);
    FileManager.readFile(uri, encoding)
      .then(result => {
        console.log('FileManager.readFile result', result.length);
        if (!result || result.length === 0) {
          const msg = t('Backup.Toast.wrongFile');
          Toast.show(msg, Toast.LONG);
          return;
        }
        const list = Bundle.parseBookList(restoreFileName, result);
        console.log('list.length', list.length);
        const limit = list.length - 1;
        // const limit = 100;
        setProcessList(list.slice(0, limit));
        setMessage(t('Backup.modalInitMessage', {total: limit}));
        setVisibleModal(true);
      })
      .catch(e => {
        console.log('FileManager.readFile error', e);
        const msg = `${restoreFileName}\n${t('Backup.Toast.wrongFile')}`;
        Toast.show(msg, Toast.LONG);
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
            label={t('Backup.Input.backup')}
            keyboardType="default"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={1}
          />
          <Button
            title={t('Backup.Button.backup')}
            type="outline"
            icon={<Icon name="save" type="material" />}
            onPress={() => {
              const content = Bundle.bundleBookList(realm, fileName);
              write(t, fileName, content);
              // Permission.checkPermissionForWriteExternalStorage(() => {
              //   write(t, fileName, content);
              // });
            }}
          />
          <View style={styles.spacer} />
          <Input
            onFocus={() => {
              console.log('onFocus Input');
              Keyboard.dismiss();
              pickFile(setRestoreFileName, setUri);
            }}
            disabledInputStyle={{color: 'black', opacity: 1}}
            containerStyle={styles.textInputBox}
            labelStyle={{fontSize: 14}}
            defaultValue={restoreFileName}
            label={t('Backup.Input.restore')}
            keyboardType="default"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={1}
          />
          <Button
            title={t('Backup.Button.restore')}
            type="outline"
            icon={<Icon name="backup-restore" type="material-community" />}
            onPress={() => {
              if (!uri) {
                const msg = t('Backup.Toast.restoreNoyReady');
                Toast.show(msg);
                return;
              }
              setProgress(0);
              setMessage(null);
              read();
            }}
          />
          <View style={styles.spacer} />
        </View>
      </ScrollView>
      <ModalProgressBar
        title={t('Backup.Button.restore')}
        message={message}
        closeButtonTitle={t('Button.close')}
        processButtonTitle={t('Button.restore')}
        visible={visibleModal}
        setVisible={setVisibleModal}
        progress={progress}
        processCallback={restore}
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

export default Backup;
