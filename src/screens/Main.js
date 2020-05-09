/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Text} from 'react-native';
import ActionButton from 'react-native-action-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
import {Icon, SearchBar, ListItem} from 'react-native-elements';

import Database from '../modules/database';
import AndroidBackHandler from '../modules/AndroidBackHandler';
import SwipeableRow from '../views/SwipeableRow';
import BookItem from '../views/BookItem';
import HeaderMenu from '../views/headerMenu';
import CategoryBar from '../views/CategoryBar';

const printIdList = list => {
  // console.log(
  //   'id list',
  //   list.map((x, index) => {
  //     return {index, id: x.id};
  //   }),
  // );
};

const renderActionButton = navigation => {
  return (
    <ActionButton buttonColor="rgba(231,76,60,1)">
      <ActionButton.Item
        buttonColor="#9b59b6"
        title="직접 입력"
        onPress={() => {
          navigation.navigate('Edit');
        }}>
        <Icon name="form" type="antdesign" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item
        buttonColor="#3498db"
        title="제목 검색"
        onPress={() => {
          navigation.navigate('SearchAdd');
        }}>
        <Icon name="search" type="material" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item
        buttonColor="#1abc9c"
        title="바코드 검색"
        onPress={() => {
          navigation.navigate('BarcodeAdd');
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

const renderBrowsableIcon = (browsable, setBrowsable) => {
  if (browsable) {
    return (
      <Icon
        iconStyle={styles.menuItem}
        onPress={() => {
          setBrowsable(false);
        }}
        name="search"
        type="material"
      />
    );
  } else {
    return (
      <Icon
        iconStyle={styles.menuItem}
        onPress={() => {
          setBrowsable(true);
        }}
        name="swap-horiz"
        type="material"
      />
    );
  }
};

const backHandler = new AndroidBackHandler();

function Main({navigation}) {
  const [realm, setRealm] = React.useState(null);
  const [list, setList] = React.useState([]);
  const [search, setSearch] = React.useState(null);
  const [sort, setSort] = React.useState(null);
  const [stack, setStack] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);
  const [browsable, setBrowsable] = React.useState(null);
  const [categoryId, setCategoryId] = React.useState(null);
  React.useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
      setSort(5);
      setBrowsable(true);
    });
    return () => {
      Database.close(realm);
    };
  }, []);
  React.useEffect(() => {
    console.log('backHandler.initBackHandler');
    backHandler.addRoutesToBeStopped(['Main']);
    backHandler.initBackHandler(backHandlerCallback);
    return () => {
      backHandler.removeBackHandler();
      console.log('backHandler.removeBackHandler');
    };
  }, [stack]);
  React.useEffect(() => {
    console.log('list_query', realm, sort, search, browsable);
    if (sort === undefined || sort === null) {
      return;
    }
    if (browsable === undefined || browsable === null) {
      return;
    }
    const sortItem = HeaderMenu.items.getItem(sort);
    let bookList = browsable
      ? Database.getBookListByCategory(realm, categoryId)
      : Database.getBookListBySearch(realm, search);
    bookList = bookList.sorted(sortItem.field, sortItem.reverse);
    bookList.addListener(listListener);
    setList(bookList);
    console.log('list_query done', bookList);
    return () => {
      bookList && bookList.removeAllListeners();
      console.log('list_query removeAllListeners');
    };
  }, [realm, sort, search, browsable, categoryId]);
  React.useEffect(() => {
    if (!realm) {
      return;
    }
    const cList = Database.getCategoryListByParentId(realm, categoryId);
    console.log('cList', cList);
    setCategoryList(cList);
  }, [realm, categoryId]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.menuContainer}>
          {renderBrowsableIcon(browsable, setBrowsable)}
          {HeaderMenu.renderHeaderMenu(sort, setSort)}
          <Icon
            iconStyle={styles.menuItem}
            onPress={() => {
              navigation.navigate('Setting');
            }}
            name="settings"
            type="material-community"
          />
        </View>
      ),
    });
  }, [navigation, sort, browsable]);
  const backHandlerCallback = () => {
    console.log('backHandler callback');
    const length = stack.length;
    if (length === 0) {
      console.log('stack.length == 0');
      return false;
    }
    console.log('stack is not empty');
    if (length === 1) {
      browse();
      return true;
    }
    const parentCategory = stack[length - 2];
    browse(parentCategory.id);
    return true;
  };
  const onUpdateSearch = text => {
    setSearch(text);
  };
  const listListener = (oldList, changes) => {
    console.log('main listListener changes', changes);
    console.log('main listListener oldList', oldList);
    printIdList(list);
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
      const newList = [...oldList];
      changes.insertions.forEach(index => {
        newList[index] = oldList[index];
      });
      setList(newList);
    }
    if (changes.insertions.length > 0) {
      console.log('changes.insertions exists');
      const newList = [...oldList];
      changes.insertions.forEach(index => {
        newList[index] = oldList[index];
      });
      setList(newList);
    }
  };
  const onDeleteRow = rowKey => {
    console.log('onDeleteRow', rowKey);
    if (!rowKey) {
      return;
    }
    const newList = [...list];
    const prevIndex = list.findIndex(item => item.id === rowKey);
    newList.splice(prevIndex, 1);
    setList(newList);
    Database.deleteBookById(realm, rowKey)
      .then(() => {
        console.log('Database.deleteBookById done', rowKey);
      })
      .catch(e => {
        console.log('Database.deleteBookById error', rowKey, e);
      });
  };
  const onPressTop = () => {
    console.log('onPressTop');
    browse();
  };
  const onPressSub = newCategoryId => {
    console.log('onPressSub', newCategoryId);
    browse(newCategoryId);
  };
  const browse = newCategoryId => {
    console.log('browse', realm, newCategoryId);
    if (!realm) {
      return;
    }
    const newStack = newCategoryId
      ? Database.getCategoryStackOnly2Level(realm, newCategoryId)
      : [];
    setStack(newStack);
    setCategoryId(newCategoryId);
  };
  const renderBar = () => {
    if (browsable) {
      return (
        <View>
          <CategoryBar
            stack={stack}
            onPressTop={onPressTop}
            onPressSub={onPressSub}
          />
          <FlatList
            data={categoryList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({item, index}) => (
              <ListItem
                key={index}
                title={item.name}
                chevron
                onPress={() => browse(item.id)}
              />
            )}
            keyExtractor={item => item.id}
          />
        </View>
      );
    } else {
      return (
        <SearchBar
          platform="default"
          placeholder={'제목, 저자'}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          onChangeText={onUpdateSearch}
          value={search}
        />
      );
    }
  };
  // printIdList(list);
  // console.log('stack', stack.map(c => c.name + ' ' + c.id));
  // console.log('categoryList', categoryList.map(c => c.name + ' ' + c.id));
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flexOne}>
        {renderBar()}
        <View style={styles.listContainer}>
          <FlatList
            data={list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({item, index}) => (
              <SwipeableRow
                rowKey={item.id}
                rowIndex={index}
                rowItem={item}
                onDeleteRow={onDeleteRow}>
                <BookItem item={item} />
              </SwipeableRow>
            )}
            keyExtractor={item => item.id}
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

export default Main;
