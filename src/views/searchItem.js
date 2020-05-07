import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Image, Icon} from 'react-native-elements';

import Database from '../modules/database';

const addBook = async ({realm, item, setList, setError}) => {
  const category = await Database.saveCategoryName(realm, item.categoryName);
  console.log(category.id, category.parentId, category.name, category.level);
  const toc = item.bookinfo && item.bookinfo.toc;
  const book = await Database.saveBook(realm, {...item, ...{category, toc}});
  console.log('new book', book.id, book.title);
  if (book) {
    book._alreadyAdded = true;
    setList([book]);
  } else {
    item._alreadyAdded = false;
    setList([item]);
  }
  setError(null);
};

const deleteBook = ({realm, item, setList, setError}) => {
  const bookId = item.id;
  console.log('Database.deleteBookById bookId', bookId);
  if (!bookId) {
    console.log('Database.deleteBookById bookId is not defined');
    return;
  }
  Database.deleteBookById(realm, item.id)
    .then(() => {
      console.log('Database.deleteBookById done', bookId);
      setList([]);
      setError(null);
    })
    .catch(e => {
      console.log('Database.deleteBookById error', bookId, e);
    });
};

const getIcon = ({realm, item, setList, setError}) => {
  if (!item._alreadyAdded) {
    return (
      <Icon
        reverse
        name="add"
        type="material"
        onPress={() => {
          addBook({realm, item, setList, setError});
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
          deleteBook({realm, item, setList, setError});
        }}
      />
    );
  }
};

const renderItem = ({realm, item, setList, setError}) => {
  // console.log('item', item);
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
      {getIcon({realm, item, setList, setError})}
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
};
