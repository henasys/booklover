/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
// import SearchBar from 'react-native-search-bar';
import {SearchBar} from 'react-native-elements';

import Aladin from '../modules/Aladin';
import Database from '../modules/database';
import SearchItem from '../views/searchItem';

function SearchAdd({navigation, route}) {
  const [realm, setRealm] = useState(null);
  const [search, setSearch] = React.useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
    });
    return () => {
      Database.close(realm);
    };
  }, []);
  const onUpdateSearch = text => {
    console.log('onUpdateSearch', text);
    setSearch(text);
  };
  const onSearchButtonPress = () => {
    console.log('onSearchButtonPress');
  };
  const onEndEditing = () => {
    console.log('onEndEditing');
    setError(null);
    setList([]);
    const searcher = new Aladin();
    searcher
      .search(search)
      .then(response => {
        console.log('searchKeyword response', response);
        if (response.errorCode) {
          const msg = `${response.errorCode} ${response.errorMessage}`;
          console.log(msg);
          setError(msg);
          return;
        }
        if (!response.item) {
          setError('검색 결과가 없습니다.');
          return;
        }
        const items = Array.isArray(response.item)
          ? response.item
          : [response.item];
        items.forEach(item => {
          item._alreadyAdded =
            Database.getBookByIsbn(realm, item.isbn, item.isbn13) !== null;
        });
        setList(items);
      })
      .catch(e => {
        console.log('searchKeyword error', e);
        setError(`검색 오류입니다. ${e}`);
      });
  };
  const onSubmitEditing = () => {
    console.log('onSubmitEditing');
  };
  const addBookCallback = item => {
    const callback = book => {
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
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flexOne}>
        <SearchBar
          platform="default"
          placeholder={'제목, 저자, ISBN'}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          onChangeText={onUpdateSearch}
          onSearchButtonPress={onSearchButtonPress}
          onEndEditing={onEndEditing}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize={'none'}
          value={search}
        />
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
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
    // paddingHorizontal: 10,
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
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

export default SearchAdd;
