/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RNCamera} from 'react-native-camera';
import {BarcodeMaskWithOuterLayout} from '@nartc/react-native-barcode-mask';
import {FlatList} from 'react-native-gesture-handler';

import Aladin from '../modules/Aladin';
import Database from '../modules/database';
import SearchItem from '../views/searchItem';

const defaultBarCodeTypes = [
  RNCamera.Constants.BarCodeType.ean13,
  RNCamera.Constants.BarCodeType.ean8,
];

const handleOnBarcodeRead = (event, setBarcode, setError, setList, realm) => {
  const isbn = event.data;
  setBarcode(isbn);
  setError(null);
  setList([]);
  const book = Database.getBookByIsbn(realm, isbn, isbn);
  if (book) {
    setError('이미 추가된 도서입니다.');
    book._alreadyAdded = true;
    setList([book]);
    setBarcodeTimer(setBarcode);
    return;
  }
  const searcher = new Aladin();
  searcher
    .searchIsbn(isbn)
    .then(response => {
      console.log('searchIsbn response', response);
      if (response.errorCode) {
        const msg = `${response.errorCode} ${response.errorMessage}`;
        console.log(msg);
        setError(msg);
        return;
      }
      const items =
        response.item && Array.isArray(response.item)
          ? response.item
          : [response.item];
      items.forEach(item => {
        item._alreadyAdded =
          Database.getBookByIsbn(realm, item.isbn, item.isbn13) !== null;
        if (item._alreadyAdded) {
          setError('이미 추가된 도서입니다.');
        }
      });
      setList(items);
    })
    .catch(e => {
      console.log('searchIsbn error', e);
      setError(`검색 오류입니다. ${e}`);
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

function BarcodeAdd() {
  const [realm, setRealm] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
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
  const onBarcodeRead = event => {
    handleOnBarcodeRead(event, setBarcode, setError, setList, realm);
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
      const newList = [...list];
      newList.splice(item._index, 1);
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
