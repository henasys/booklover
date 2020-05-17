/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements';
import HTMLView from 'react-native-htmlview';

import Database from '../modules/database';
import TimeUtil from '../modules/timeUtil';
import LocaleContext from '../modules/LocaleContext';

import BookCover from '../views/BookCover';

const sanitizeHtml = require('sanitize-html');

function Detail({navigation, route}) {
  const {t} = React.useContext(LocaleContext);
  const [realm, setRealm] = useState(null);
  const [book, setBook] = useState(null);
  useEffect(() => {
    Database.open(_realm => {
      setRealm(_realm);
      // console.log('Database.open');
    });
    return () => {
      Database.close(realm);
      // console.log('Database.close');
    };
  }, []);
  useEffect(() => {
    if (!realm) {
      return;
    }
    const {bookId} = route.params;
    if (!bookId) {
      return;
    }
    const newBook = Database.getBookById(realm, bookId);
    setBook(newBook);
    if (!newBook) {
      return;
    }
    newBook.addListener && newBook.addListener(bookListener);
    console.log('newBook.addListener');
    return () => {
      newBook.removeAllListeners && newBook.removeAllListeners();
      console.log('newBook.removeAllListeners');
    };
  }, [realm]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.menuContainer}>
          <Icon
            iconStyle={styles.menuItem}
            onPress={() => {
              navigation.navigate('Edit', {book: book});
            }}
            name="edit"
            type="material"
          />
        </View>
      ),
    });
  }, [navigation, book]);
  const bookListener = (oldBook, changes) => {
    console.log('bookListener changes', changes);
    console.log('bookListener oldBook', oldBook);
    if (changes.changedProperties.length > 0) {
      const newBook = Database.bookToObject(oldBook);
      setBook(newBook);
    }
  };
  if (!book) {
    return <View />;
  }
  console.log('book', Database.bookToObject(book));
  const description = book.description ? sanitizeHtml(book.description) : '';
  const toc = book.toc ? book.toc : '';
  const published = published
    ? TimeUtil.timeToYearMonth(book.published, 'Y-MM')
    : '';
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <View style={styles.spacer} />
        <View style={styles.rowContainer}>
          <BookCover book={book} />
          <View style={styles.bookInfo}>
            <Text
              style={styles.author}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {book.author}
            </Text>
            <View style={styles.spacer} />
            <Text
              style={styles.author}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {book.publisher} {published}
            </Text>
            <View style={styles.spacer} />
            <Text
              style={styles.category}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {book.category?.name}
            </Text>
            <View style={styles.spacer} />
            <Text style={styles.isbn} numberOfLines={2} ellipsizeMode={'tail'}>
              {book.isbn} {book.isbn13}
            </Text>
          </View>
        </View>
        <View style={styles.spacer} />
        <Text style={styles.sectionTitle}>{t('Detail.description')}</Text>
        <View style={styles.spacer} />
        <View style={styles.htmlContainer}>
          <HTMLView value={description} />
        </View>
        <View style={styles.spacer} />
        <Text style={styles.sectionTitle}>{t('Detail.toc')}</Text>
        <View style={styles.spacer} />
        <View style={styles.htmlContainer}>
          <HTMLView value={toc} />
        </View>
        <View style={styles.spacer} />
      </ScrollView>
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
  contentContainer: {
    margin: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    paddingVertical: 5,
  },
  cover: {
    width: 100,
    height: 100,
  },
  bookInfo: {
    flexDirection: 'column',
    width: '70%',
    // marginHorizontal: 10,
    marginLeft: 10,
    // marginVertical: 10,
  },
  title: {
    fontSize: 18,
  },
  author: {
    color: 'darkslategrey',
  },
  category: {
    color: 'navy',
  },
  isbn: {
    color: 'darkslategrey',
  },
  sectionTitle: {
    fontSize: 18,
  },
  htmlContainer: {
    marginHorizontal: 20,
  },
});

export default Detail;
