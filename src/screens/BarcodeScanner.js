import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RNCamera} from 'react-native-camera';
import {BarcodeMaskWithOuterLayout} from '@nartc/react-native-barcode-mask';
import {FlatList} from 'react-native-gesture-handler';
import {Image, Icon} from 'react-native-elements';

import Aladin from '../modules/Aladin';

const defaultBarCodeTypes = [
  RNCamera.Constants.BarCodeType.ean13,
  RNCamera.Constants.BarCodeType.ean8,
];

const renderItem = item => {
  console.log('item', item);
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
      <Icon
        reverse
        name="add"
        type="material"
        onPress={() => {
          console.log('add clicked');
        }}
      />
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
  const [barcode, setBarcode] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
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
        if (Array.isArray(response.item)) {
          setList(response.item);
        } else {
          setList([response.item]);
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
          renderItem={({item}) => renderItem(item)}
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
    marginVertical: 10,
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
  },
  error: {
    color: 'crimson',
  },
});

export default BarcodeScanner;
