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
      .searchKeyword(search)
      .then(response => {
        console.log('searchKeyword response', response);
        if (response.errorCode) {
          const msg = `${response.errorCode} ${response.errorMessage}`;
          console.log(msg);
          setError(msg);
          return;
        }
        const item = response.item;
        setList(item);
      })
      .catch(e => {
        console.log('searchKeyword error', e);
        setError(`검색 오류입니다. ${e}`);
      });
  };
  const onSubmitEditing = () => {
    console.log('onSubmitEditing');
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
            renderItem={({item}) =>
              SearchItem.renderItem({realm, item, setList, setError})
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
