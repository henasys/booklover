/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ActionButton from 'react-native-action-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
import {Image, Icon} from 'react-native-elements';

import Database from '../modules/database';

const renderItem = (realm, item, setList) => {
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
    </View>
  );
};

function Main({navigation}) {
  const [realm, setRealm] = React.useState(null);
  const [list, setList] = React.useState([]);
  React.useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
      setList(Database.getBookList(_realm));
    });
    return () => {
      Database.close(realm);
    };
  }, []);
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
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={list}
          renderItem={({item}) => renderItem(realm, item, setList)}
          keyExtractor={(item, index) => String(index)}
        />
      </View>
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
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
});

export default Main;
