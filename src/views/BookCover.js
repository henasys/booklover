import React from 'react';
import {StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native';
// import {Image} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

function BookCover({book, style = {}}) {
  const source = book.cover
    ? {uri: book.cover}
    : require('../images/no-image.png');
  const imageStyle = {...styles.cover, ...style};
  return (
    <FastImage
      style={imageStyle}
      source={source}
      defaultSource={require('../images/no-image.png')}
      PlaceholderContent={<ActivityIndicator />}
    />
  );
}

const styles = StyleSheet.create({
  cover: {
    width: 100,
    height: 100,
  },
});

export default BookCover;
