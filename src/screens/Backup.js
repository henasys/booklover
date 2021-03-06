/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Icon, Input} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';
import {Subject} from 'rxjs';

import Database from '../modules/database';
import FileManager from '../modules/fileManager';
import Bundle from '../modules/bundle';
import LocaleContext from '../modules/LocaleContext';
import Permission from '../modules/permission';

import PickFileInput from '../views/PickFileInput';
import ModalProgressBar from '../views/ModalProgressBar';
import MyAlert from '../views/alert';

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
      const msg = `${t('Backup.Toast.writeFail')}: ${fileName}`;
      Toast.show(msg);
    });
};

const readDir = () => {
  console.log('readDir');
  FileManager.readDirDocumentDirectory()
    .then(result => {
      result.forEach(item => {
        console.log(item);
      });
    })
    .catch(e => {
      console.log(e);
    });
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
  const [buttonPressed, setButtonPressed] = useState(false);
  useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
    });
    return () => {
      Database.close(realm);
    };
  }, []);
  useEffect(() => {
    FileManager.existsBookLoverPath(fileName)
      .then(exists => {
        if (exists) {
          setRestoreFileName(fileName);
          const path = FileManager.getBookLoverPath(fileName);
          setUri(path);
        } else {
          setRestoreFileName(null);
          setUri(null);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }, [fileName]);
  const onEndEditingFileName = () => {
    if (!fileName || fileName.length === 0) {
      setFileNameError(t('Backup.fileNameEmptyError'));
    }
  };
  const restore = () => {
    console.log('restore start');
    const limit = processList.length;
    if (limit === 0) {
      setProgress(1);
      return;
    }
    let progressTotal = 0;
    const errorList = [];
    const successList = [];
    const updateProgress = () => {
      progressTotal += 1;
      const progressValue = progressTotal / limit;
      // console.log('progressTotal', progressTotal, 'index', index);
      // console.log('progressValue', progressValue, 'index', index);
      setTimeout(() => {
        setProgress(progressValue);
      }, 10);
    };
    const updateMessage = () => {
      const msg = t('Backup.modalMessage', {
        total: processList.length,
        success: successList.length,
        failure: errorList.length,
      });
      setTimeout(() => {
        setMessage(msg);
      }, 10);
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
    processList.forEach(async (book, index) => {
      try {
        const resultBook = await Database.saveOrUpdateBook(realm, book);
        if (resultBook) {
          successList.push(book.title);
          // const msg = `restore done: ${resultBook.title}`;
          // console.log(msg);
        }
      } catch (e) {
        errorList.push(book.title);
        console.log('restore error', e);
      } finally {
        progressUpdater.next(index);
      }
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
        const limit = list.length;
        setProcessList(limit === list.length ? list : list.slice(0, limit));
        setMessage(t('Backup.modalInitMessage', {total: limit}));
        setVisibleModal(true);
      })
      .catch(e => {
        console.log('FileManager.readFile error', e);
        const msg = `${restoreFileName}\n${t('Backup.Toast.wrongFile')}`;
        Toast.show(msg, Toast.LONG);
      });
  };
  const _onPressBackup = () => {
    const list = Database.getBookList(realm);
    const alertTitle = t('Backup.BackupAlert.title');
    const alertMessage = t('Backup.BackupAlert.message', {
      total: list.length,
    });
    const okCallback = () => {
      const content = Bundle.bundleBookList(realm, fileName);
      const errorCallback = code => {
        const msg = t('Error.permission', {error: code});
        console.log(msg);
        Toast.show(msg);
      };
      Permission.checkPermissionForReadExternalStorage(() => {
        Permission.checkPermissionForWriteExternalStorage(() => {
          write(t, fileName, content);
        }, errorCallback);
      }, errorCallback);
    };
    const cancelCallback = () => {};
    MyAlert.showTwoButtonAlert(
      alertTitle,
      alertMessage,
      okCallback,
      cancelCallback,
    );
  };
  const _onPressShare = async () => {
    if (!fileName) {
      return;
    }
    const path = FileManager.getBookLoverPath(fileName);
    const shareOptions = {
      failOnCancel: false,
      saveToFiles: true,
      url: `file://${path}`,
    };
    try {
      const exists = await FileManager.existsBookLoverPath(fileName);
      if (exists) {
        const ShareResponse = await Share.open(shareOptions);
        console.log(JSON.stringify(ShareResponse, null, 2));
      } else {
        const msg = t('Backup.Toast.wrongFile');
        Toast.show(msg);
        return;
      }
    } catch (error) {
      console.log('Error =>', error);
    }
  };
  const _onPressRestore = () => {
    if (!uri) {
      const msg = t('Backup.Toast.restoreNoyReady');
      Toast.show(msg);
      return;
    }
    setProgress(0);
    setMessage(null);
    setButtonPressed(false);
    const errorCallback = code => {
      const msg = t('Error.permission', {error: code});
      console.log(msg);
      Toast.show(msg);
    };
    Permission.checkPermissionForReadExternalStorage(() => {
      read();
    }, errorCallback);
  };
  // console.log('Backup render');
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
            onPress={_onPressBackup}
          />
          <View style={styles.spacer} />
          <Button
            title={t('Backup.Button.share')}
            type="outline"
            icon={<Icon name="share" type="material" />}
            onPress={_onPressShare}
          />
          <View style={styles.spacer} />
          <PickFileInput
            label={t('Backup.Input.restore')}
            type={PickFileInput.Type.excel}
            filename={restoreFileName}
            setFilename={setRestoreFileName}
            setUri={setUri}
          />
          <Button
            title={t('Backup.Button.restore')}
            type="outline"
            icon={<Icon name="backup-restore" type="material-community" />}
            onPress={_onPressRestore}
          />
          <View style={styles.spacer} />
        </View>
      </ScrollView>
      <ModalProgressBar
        title={t('Backup.Button.restore')}
        message={message}
        closeButtonTitle={t('Button.close')}
        processButtonTitle={
          buttonPressed ? t('Button.processing') : t('Button.restore')
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
            restore();
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

export default Backup;
