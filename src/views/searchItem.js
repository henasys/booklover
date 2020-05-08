import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Image, Icon} from 'react-native-elements';

import Database from '../modules/database';

const addBook = async ({
  realm,
  item,
  callback = null,
  errorCallback = null,
}) => {
  const category = await Database.saveCategoryName(realm, item.categoryName);
  console.log(category.id, category.parentId, category.name, category.level);
  const toc = item.bookinfo && item.bookinfo.toc;
  Database.saveBook(realm, {...item, ...{category, toc}})
    .then(book => {
      console.log('Database.saveBook done', book.id, book.title);
      book._alreadyAdded = true;
      callback(book);
    })
    .catch(e => {
      console.log('Database.saveBook error', item.title, e);
      errorCallback(e);
    });
};

const deleteBook = ({realm, item, callback = null, errorCallback = null}) => {
  const bookId = item.id;
  console.log('Database.deleteBookById bookId', bookId);
  if (!bookId) {
    console.log('Database.deleteBookById bookId is not defined');
    return;
  }
  callback();
  Database.deleteBookById(realm, bookId)
    .then(() => {
      console.log('Database.deleteBookById done', bookId);
    })
    .catch(e => {
      console.log('Database.deleteBookById error', bookId, e);
      errorCallback(e);
    });
};

const getIcon = ({item, addBookCallback = null, deleteBookCallback = null}) => {
  if (!item._alreadyAdded) {
    return (
      <Icon
        reverse
        name="add"
        type="material"
        onPress={() => {
          addBookCallback && addBookCallback(item);
        }}
      />
    );
  } else {
    return (
      <Icon
        reverse
        name="delete"
        type="material"
        color="crimson"
        onPress={() => {
          deleteBookCallback && deleteBookCallback(item);
        }}
      />
    );
  }
};

const renderItem = ({
  item,
  index,
  addBookCallback = null,
  deleteBookCallback = null,
}) => {
  // console.log('item', item);
  if (!item) {
    return null;
  }
  item._index = index;
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
        <Text style={styles.category} numberOfLines={2} ellipsizeMode={'tail'}>
          {item.categoryName}
        </Text>
      </View>
      {getIcon({item, addBookCallback, deleteBookCallback})}
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

const styles = StyleSheet.create({
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
  category: {
    color: 'chocolate',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eeee',
    padding: 10,
    // borderWidth: 1,
  },
  error: {
    color: 'crimson',
  },
});

export default {
  renderItem,
  renderError,
  addBook,
  deleteBook,
};
