/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RNCamera} from 'react-native-camera';
import {BarcodeMaskWithOuterLayout} from '@nartc/react-native-barcode-mask';
import {FlatList} from 'react-native-gesture-handler';

import Database from '../modules/database';
import Searcher from '../modules/searcher';
import LocaleContext from '../modules/LocaleContext';

import SearchItem from '../views/searchItem';
import SelectApiButton from '../views/SelectApiButton';

const IsbnUtil = require('isbn-utils');

const defaultBarCodeTypes = [
  RNCamera.Constants.BarCodeType.ean13,
  RNCamera.Constants.BarCodeType.ean8,
];

const handleOnBarcodeRead = ({
  t,
  event,
  realm,
  apiSource,
  setBarcode,
  setError,
  setList,
}) => {
  const isbn = event.data;
  const checkIsbn = IsbnUtil.parse(isbn);
  if (!checkIsbn) {
    setBarcode(isbn);
    setError(t('BarcodeAdd.Error.wrongIsbn'));
    setList([]);
    return;
  }
  setBarcode(isbn);
  setError(null);
  setList([]);
  const book = Database.getBookByIsbn(realm, isbn, isbn);
  if (book) {
    setError(t('BarcodeAdd.Error.alreadyAdded'));
    book._alreadyAdded = true;
    setList([book]);
    setBarcodeTimer(setBarcode);
    return;
  }
  const searcher = Searcher.getSearcherBy(apiSource);
  searcher
    .searchIsbn(isbn)
    .then(items => {
      console.log('searchIsbn items', items);
      if (items.length > 0) {
        const item = items[0];
        item.apiSource = searcher.apiSource;
        const bookByIsbn = Database.getBookByIsbn(
          realm,
          item.isbn,
          item.isbn13,
        );
        item._alreadyAdded = bookByIsbn !== null;
        if (item._alreadyAdded) {
          setError(t('BarcodeAdd.Error.alreadyAdded'));
          setList(items);
          return;
        }
        Searcher.postProcess(searcher, item)
          .then(mBook => {
            setList([mBook]);
          })
          .catch(e => {});
      }
    })
    .catch(e => {
      console.log('searchIsbn error', e);
      setError(`${t('BarcodeAdd.Error.search')} ${e}`);
    })
    .finally(() => {
      setBarcodeTimer(setBarcode);
    });
};

const setBarcodeTimer = setBarcode => {
  setTimeout(() => {
    setBarcode(null);
  }, 2000);
};

function BarcodeAdd({navigation, route}) {
  const {t} = React.useContext(LocaleContext);
  const [realm, setRealm] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
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
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.menuContainer}>
          <View style={styles.menuItem}>
            <SelectApiButton
              apiSource={apiSource}
              onValueChanged={setApiSource}
            />
          </View>
        </View>
      ),
    });
  }, [navigation, apiSource]);
  const onBarcodeRead = event => {
    handleOnBarcodeRead({
      t,
      event,
      realm,
      apiSource,
      setBarcode,
      setError,
      setList,
    });
  };
  const addBookCallback = item => {
    const callback = book => {
      setError(null);
      const newList = [...list];
      newList[item._index] = book;
      setList(newList);
    };
    const errorCallback = e => {};
    SearchItem.addBook({realm, item, callback, errorCallback});
  };
  const deleteBookCallback = item => {
    const callback = () => {
      setError(null);
      const itemClone = Database.bookToObject(item);
      const newList = [...list];
      itemClone._alreadyAdded = false;
      console.log('itemClone', itemClone);
      newList[item._index] = itemClone;
      setList(newList);
    };
    const errorCallback = e => {};
    SearchItem.deleteBook({realm, item, callback, errorCallback});
  };
  const barCodeTypes = barcode ? [] : defaultBarCodeTypes;
  return (
    <SafeAreaView style={styles.container}>
      <RNCamera
        androidCameraPermissionOptions={{
          title: 'permissionCamera',
          message: 'permissionCameraMessage',
          buttonPositive: 'ok',
          buttonNegative: 'cancel',
        }}
        style={styles.scanner}
        type={RNCamera.Constants.Type.back}
        barCodeTypes={barCodeTypes}
        onBarCodeRead={onBarcodeRead}
        captureAudio={false}>
        <BarcodeMaskWithOuterLayout
          maskOpacity={0.5}
          width={'90%'}
          height={100}
          showAnimatedLine={barcode === null}
        />
      </RNCamera>
      {SearchItem.renderError(error)}
      <View style={styles.listContainer}>
        <FlatList
          data={list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({item, index}) =>
            SearchItem.renderItem({
              item,
              index,
              addBookCallback,
              deleteBookCallback,
            })
          }
          keyExtractor={(item, index) => String(index)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    backgroundColor: 'black',
  },
  menuContainer: {
    flexDirection: 'row',
  },
  menuItem: {
    marginRight: 10,
  },
  scanner: {
    flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    height: 150,
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
    // paddingHorizontal: 10,
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10,
    // marginVertical: 10,
    // borderWidth: 1,
  },
  cover: {
    width: 80,
    height: 80,
  },
  bookInfo: {
    flexDirection: 'column',
    width: '55%',
    // marginHorizontal: 10,
    marginLeft: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
  },
  author: {
    color: 'grey',
  },
  isbn: {
    color: 'navy',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eeee',
    padding: 10,
    // borderWidth: 1,
  },
  error: {
    color: 'crimson',
  },
});

export default BarcodeAdd;
