import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';

import MyColor from '../modules/myColor';

export default function CategoryItem({item, onPress}) {
  if (!item) {
    return null;
  }
  return (
    <ListItem
      title={`${item.name} (${item._count})`}
      chevron={
        <Icon name="chevron-right" type="material" color={MyColor.font1} />
      }
      onPress={onPress}
      titleStyle={styles.title}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    color: MyColor.font1,
    paddingLeft: 10,
  },
});
