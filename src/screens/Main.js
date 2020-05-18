/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View, StyleSheet, KeyboardAvoidingView} from 'react-native';
import ActionButton from 'react-native-action-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
import {Icon, SearchBar} from 'react-native-elements';

import Database from '../modules/database';
import AndroidBackHandler from '../modules/AndroidBackHandler';
import LocaleContext from '../modules/LocaleContext';
import ListListener from '../modules/ListListener';

import SwipeableRow from '../views/SwipeableRow';
import BookItem from '../views/BookItem';
import HeaderMenu from '../views/HeaderMenu';
import CategoryBar from '../views/CategoryBar';
import CategoryItem from '../views/CategoryItem';

const renderActionButton = (navigation, t) => {
  return (
    <ActionButton buttonColor="rgba(231,76,60,1)">
      <ActionButton.Item
        buttonColor="#9b59b6"
        title={t('Main.ActionButton.inputManually')}
        onPress={() => {
          navigation.navigate('Edit');
        }}>
        <Icon name="form" type="antdesign" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item
        buttonColor="#3498db"
        title={t('Main.ActionButton.titleSearch')}
        onPress={() => {
          navigation.navigate('SearchAdd');
        }}>
        <Icon name="search" type="material" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item
        buttonColor="#1abc9c"
        title={t('Main.ActionButton.barcodeSearch')}
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
  const {t} = React.useContext(LocaleContext);
  const [realm, setRealm] = React.useState(null);
  const [list, setList] = React.useState([]);
  const [search, setSearch] = React.useState(null);
  const [sort, setSort] = React.useState(null);
  const [browsable, setBrowsable] = React.useState(null);
  const [stack, setStack] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);
  const [categoryId, setCategoryId] = React.useState(null);
  const [countList, setCountList] = React.useState([]);
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
    if (!realm) {
      return;
    }
    refreshCountList();
    const listListener = new ListListener(refreshCountList, 'all_list');
    const allList = Database.getBookList(realm);
    allList.addListener(listListener.listener);
    return () => {
      allList.removeAllListeners();
      console.log('allList removeAllListeners');
    };
  }, [realm]);
  React.useEffect(() => {
    if (!realm) {
      return;
    }
    const newStack = categoryId
      ? Database.getCategoryStackOnly2Level(realm, categoryId)
      : [];
    setStack(newStack);
    console.log('setStack', newStack);
  }, [realm, categoryId]);
  React.useEffect(() => {
    if (!realm) {
      return;
    }
    const cList = Database.getCategoryListByParentId(realm, categoryId).sorted(
      'name',
    );
    const listListener = new ListListener(setCategoryList, 'category_list');
    cList.addListener(listListener.listener);
    const cListCount = cList.map(c => {
      const countItem = countList.find(item => item.categoryId === c.id);
      c._count = countItem ? countItem.count : 0;
      return c;
    });
    console.log('countList', countList.length);
    // console.log('cListCount', cListCount);
    setCategoryList(cListCount);
    return () => {
      cList.removeAllListeners();
      console.log('cList removeAllListeners');
    };
  }, [realm, categoryId, countList]);
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
    const listListener = new ListListener(setList, 'book_list');
    bookList.addListener(listListener.listener);
    setList(bookList);
    console.log('list_query done', bookList.length);
    return () => {
      bookList && bookList.removeAllListeners();
      console.log('bookList removeAllListeners');
    };
  }, [realm, sort, search, browsable, categoryId]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.menuContainer}>
          {renderBrowsableIcon(browsable, setBrowsable)}
          <HeaderMenu sort={sort} callback={setSort} />
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
  const refreshCountList = () => {
    const newCountList = [];
    Database.getBookCountByCategory(realm, null, newCountList);
    console.log('refreshCountList newCountList', newCountList.length);
    setCountList(newCountList);
  };
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
    setCategoryId(newCategoryId);
  };
  const renderBar = () => {
    if (browsable) {
      return (
        <View>
          <CategoryBar
            stack={stack}
            countList={countList}
            onPressTop={onPressTop}
            onPressSub={onPressSub}
          />
          <FlatList
            data={categoryList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({item, index}) => (
              <CategoryItem item={item} onPress={() => browse(item.id)} />
            )}
            keyExtractor={item => item.id}
          />
        </View>
      );
    } else {
      return (
        <SearchBar
          platform="default"
          placeholder={t('Main.searchBarPlaceholder')}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          onChangeText={onUpdateSearch}
          value={search}
        />
      );
    }
  };
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
            keyExtractor={(item, index) => item.id + '_' + String(index)}
          />
        </View>
        {renderActionButton(navigation, t)}
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
