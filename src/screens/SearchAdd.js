/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
// import SearchBar from 'react-native-search-bar';
import {SearchBar} from 'react-native-elements';

import Database from '../modules/database';
import Searcher from '../modules/searcher';
import LocaleContext from '../modules/LocaleContext';

import SearchItem from '../views/searchItem';
import SelectApiButton from '../views/SelectApiButton';

function SearchAdd({navigation, route}) {
  const {t} = React.useContext(LocaleContext);
  const [realm, setRealm] = useState(null);
  const [search, setSearch] = React.useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [apiSource, setApiSource] = useState(null);
  useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
    });
    return () => {
      Database.close(realm);
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
    const searcher = Searcher.getSearcherBy(apiSource);
    searcher
      .search(search)
      .then(items => {
        console.log('search items', items.length);
        if (items.length === 0) {
          setError(t('SearchAdd.Error.noResult'));
          return;
        }
        items.forEach(item => {
          const book = Database.getBookByIsbn(realm, item.isbn, item.isbn13);
          item._alreadyAdded = book !== null;
          item.id = book && book.id;
        });
        setList(items);
      })
      .catch(e => {
        console.log('search error', e);
        setError(`${t('SearchAdd.Error.search')} ${e}`);
      });
  };
  const onSubmitEditing = () => {
    console.log('onSubmitEditing');
  };
  const addBookCallback = item => {
    setError('');
    const callback = book => {
      const newList = [...list];
      newList[item._index] = book;
      setList(newList);
    };
    const errorCallback = e => {
      setError(`${t('SearchAdd.Error.add')} ${e}`);
    };
    const searcher = Searcher.getSearcher(realm);
    Searcher.postProcess(searcher, item)
      .then(async book => {
        await SearchItem.addBook({realm, item: book, callback, errorCallback});
      })
      .catch(e => {});
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
          placeholder={t('SearchAdd.searchBarPlaceholder')}
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
  menuContainer: {
    flexDirection: 'row',
  },
  menuItem: {
    marginRight: 10,
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
