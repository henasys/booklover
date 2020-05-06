/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image} from 'react-native-elements';

function Detail({navigation, route}) {
  const {book} = route.params;
  if (!book) {
    return <View />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <View style={styles.spacer} />
        <View style={styles.rowContainer}>
          <Image style={styles.cover} source={{uri: book.cover}} />
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
              {book.publisher} {book.pubDate}
            </Text>
            <View style={styles.spacer} />
            <Text
              style={styles.category}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {book.category.name}
            </Text>
            <View style={styles.spacer} />
            <Text style={styles.isbn} numberOfLines={2} ellipsizeMode={'tail'}>
              {book.isbn} {book.isbn13}
            </Text>
          </View>
        </View>
        <View style={styles.spacer} />
        <Text>내용 소개</Text>
        <View style={styles.spacer} />
        <Text>{book.description}</Text>
        <View style={styles.spacer} />
        <Text>목차</Text>
        <View style={styles.spacer} />
        <Text>{book.toc}</Text>
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default Detail;
