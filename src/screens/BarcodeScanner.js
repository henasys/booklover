import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RNCamera} from 'react-native-camera';
import {BarcodeMaskWithOuterLayout} from '@nartc/react-native-barcode-mask';

const defaultBarCodeTypes = [
  RNCamera.Constants.BarCodeType.ean13,
  RNCamera.Constants.BarCodeType.ean8,
];

function BarcodeScanner(props) {
  const [barcode, setBarcode] = useState(null);
  const onBarcodeRead = event => {
    console.log('onBarcodeRead', event);
    setBarcode(event.data);
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
          width={'80%'}
          height={100}
          showAnimatedLine={barcode === null}
        />
      </RNCamera>
      <View style={styles.listContainer}>
        <Text>Barcode: {barcode}</Text>
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
    flex: 2,
    backgroundColor: 'white',
  },
});

export default BarcodeScanner;
