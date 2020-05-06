/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ActionButton from 'react-native-action-button';
import {Icon} from 'react-native-elements';

import Aladin from '../modules/Aladin';
import Database from '../modules/database';

function Main({navigation}) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.menuContainer}>
          <Icon
            iconStyle={styles.menuItem}
            onPress={() => {
              Database.clearAllDatabase();
            }}
            name="delete"
            type="material-community"
          />
          <Icon
            iconStyle={styles.menuItem}
            onPress={() => {
              Database.clearAllDatabase();
            }}
            name="sort"
            type="material-community"
          />
        </View>
      ),
    });
  }, [navigation]);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Main Screen</Text>
      <ActionButton buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item
          buttonColor="#3498db"
          title="제목 검색"
          onPress={() => {}}>
          <Icon name="search" type="material" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#1abc9c"
          title="바코드 검색"
          onPress={() => {
            navigation.navigate('BarcodeScanner');
          }}>
          <Icon
            name="barcode-scan"
            type="material-community"
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
      </ActionButton>
    </View>
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default Main;
