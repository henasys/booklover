/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
import {Image, Icon, SearchBar} from 'react-native-elements';

import Database from '../modules/database';
import AndroidBackHandler from '../modules/AndroidBackHandler';

const renderItem = (item, navigation) => {
  if (!item) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Detail', {book: item});
      }}>
      <View style={styles.itemContainer}>
        <Image style={styles.cover} source={{uri: item.cover}} />
        <View style={styles.bookInfo}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode={'tail'}>
            {item.title}
          </Text>
          <Text style={styles.author} numberOfLines={2} ellipsizeMode={'tail'}>
            {item.author}
          </Text>
          <Text
            style={styles.category}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {item.category.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const renderActionButton = navigation => {
  return (
    <ActionButton buttonColor="rgba(231,76,60,1)">
      <ActionButton.Item
        buttonColor="#9b59b6"
        title="수동 입력"
        onPress={() => console.log('notes tapped!')}>
        <Icon name="form" type="antdesign" style={styles.actionButtonIcon} />
      </ActionButton.Item>
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
  );
};

function Main({navigation}) {
  const [realm, setRealm] = React.useState(null);
  const [list, setList] = React.useState([]);
  const [search, setSearch] = React.useState(null);
  React.useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
      const bookList = Database.getBookList(_realm);
      bookList.addListener(listListener);
      setList(bookList);
    });
    return () => {
      Database.close(realm);
    };
  }, []);
  React.useEffect(() => {
    const backHandler = new AndroidBackHandler();
    backHandler.addRoutesToBeStopped(['Main']);
    backHandler.initBackHandler();
    return () => {
      backHandler.removeBackHandler();
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
  const onUpdateSearch = text => {
    setSearch(text);
    const books = Database.getBookListBySearch(realm, text);
    setList(books);
  };
  const listListener = (oldList, changes) => {
    console.log('main listListener changes', changes);
    console.log('main listListener oldList', oldList);
    if (changes.deletions.length > 0) {
      console.log('changes.deletions exists');
      const newList = [];
      for (let index = 0; index < oldList.length; index++) {
        const element = oldList[index];
        if (!changes.deletions.includes(index)) {
          newList.push(element);
        }
      }
      setList(newList);
    }
    if (changes.modifications.length > 0) {
      console.log('changes.modifications exists');
      setList(oldList);
    }
    if (changes.insertions.length > 0) {
      console.log('changes.insertions exists');
      const newList = [...oldList];
      setList(newList);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flexOne}>
        <SearchBar
          platform="default"
          placeholder={'제목, 저자'}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          onChangeText={onUpdateSearch}
          value={search}
        />
        <View style={styles.listContainer}>
          <FlatList
            data={list}
            renderItem={({item}) => renderItem(item, navigation)}
            keyExtractor={(item, index) => item.id}
          />
        </View>
        {renderActionButton(navigation)}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexOne: {
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
    width: '70%',
    // marginHorizontal: 10,
    marginLeft: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 15,
  },
  author: {
    color: 'grey',
  },
  category: {
    color: 'navy',
  },
  searchBarContainer: {
    backgroundColor: 'lightslategrey',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  searchBarInputContainer: {
    backgroundColor: 'white',
  },
});

export default Main;
