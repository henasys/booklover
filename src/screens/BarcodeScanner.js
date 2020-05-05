/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RNCamera} from 'react-native-camera';
import {BarcodeMaskWithOuterLayout} from '@nartc/react-native-barcode-mask';
import {FlatList} from 'react-native-gesture-handler';
import {Image, Icon} from 'react-native-elements';

import Aladin from '../modules/Aladin';
import Database from '../modules/database';

const defaultBarCodeTypes = [
  RNCamera.Constants.BarCodeType.ean13,
  RNCamera.Constants.BarCodeType.ean8,
];

const addBook = async (realm, item, callback) => {
  const category = await Database.saveCategoryName(realm, item.categoryName);
  console.log(category.id, category.parentId, category.name, category.level);
  const book = await Database.saveBook(realm, {...item, ...{category}});
  console.log('new book', book.id, book.title);
  item._book = book;
  callback(item);
};

const getIcon = (realm, item, callback) => {
  if (!item._book) {
    return (
      <Icon
        reverse
        name="add"
        type="material"
        onPress={() => {
          addBook(realm, item, callback);
        }}
      />
    );
  } else {
    return <Icon disabled reverse name="check" type="material" />;
  }
};

const renderItem = (realm, item, callback) => {
  console.log('item', item);
  if (!item) {
    return null;
  }
  return (
    <View style={styles.itemContainer}>
      <Image style={styles.cover} source={{uri: item.cover}} />
      <View style={styles.bookInfo}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode={'tail'}>
          {item.title}
        </Text>
        <Text style={styles.author} numberOfLines={2} ellipsizeMode={'tail'}>
          {item.author}
        </Text>
        <Text style={styles.isbn} numberOfLines={2} ellipsizeMode={'tail'}>
          {item.isbn} {item.isbn13}
        </Text>
      </View>
      {getIcon(realm, item, callback)}
    </View>
  );
};

const renderError = error => {
  if (!error) {
    return null;
  }
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.error}>{error}</Text>
    </View>
  );
};

function BarcodeScanner(props) {
  const [realm, setRealm] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
      console.log('Database.open');
    });
    return () => {
      Database.close(realm);
      console.log('Database.close');
    };
  }, []);
  const onBarcodeRead = event => {
    console.log('onBarcodeRead', event);
    const isbn = event.data;
    setBarcode(isbn);
    setError(null);
    setList([]);
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
        const item = response.item;
        const book = Database.getBookByIsbn(realm, item.isbn, item.isbn13);
        item._book = book;
        if (book) {
          setError('이미 추가된 도서입니다.');
        }
        if (Array.isArray(item)) {
          setList(item);
        } else {
          setList([item]);
        }
      })
      .catch(e => {
        console.log('searchIsbn error', e);
        setError(`검색 오류입니다. ${e}`);
      })
      .finally(() => {
        setTimeout(() => {
          setBarcode(null);
        }, 2000);
      });
  };
  const callbackForItemChanged = item => {
    setList([item]);
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
      {renderError(error)}
      <View style={styles.listContainer}>
        <FlatList
          data={list}
          renderItem={({item}) =>
            renderItem(realm, item, callbackForItemChanged)
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
    backgroundColor: 'white',
    padding: 10,
    // borderWidth: 1,
  },
  error: {
    color: 'crimson',
  },
});

export default BarcodeScanner;
