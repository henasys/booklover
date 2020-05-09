import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native-elements';

function BookItem({item}) {
  const navigation = useNavigation();
  if (!item) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Detail', {book: item});
      }}>
      <View style={styles.itemContainer}>
        <Image style={styles.cover} source={{uri: item.cover}} />
        <View style={styles.bookInfo}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode={'tail'}>
            {item.title}
          </Text>
          <Text style={styles.author} numberOfLines={2} ellipsizeMode={'tail'}>
            {item.author}
          </Text>
          <Text
            style={styles.category}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {item.category?.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
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
    width: '70%',
    // marginHorizontal: 10,
    marginLeft: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 15,
  },
  author: {
    color: 'grey',
  },
  category: {
    color: 'navy',
  },
});

export default BookItem;
