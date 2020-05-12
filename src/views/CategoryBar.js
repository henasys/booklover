import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import MyColor from '../modules/myColor';

function CategoryBar({stack, onPressTop, onPressSub = null}) {
  const rootView = (
    <Text style={style.text} onPress={onPressTop}>
      분류
    </Text>
  );
  const topDivider = <Text style={[style.text, style.subText]}> | </Text>;
  let firstView = null;
  let secondView = null;
  let secondDivider = null;
  if (stack.length >= 2) {
    const category = stack[1];
    secondView = (
      <Text
        style={[style.text, style.subText]}
        onPress={() => {
          onPressSub && onPressSub(category.id);
        }}>
        {category.name}
      </Text>
    );
    secondDivider = <Text style={style.text}> > </Text>;
  }
  if (stack.length >= 1) {
    const category = stack[0];
    firstView = (
      <Text
        style={[style.text, style.subText]}
        onPress={() => {
          onPressSub && onPressSub(category.id);
        }}>
        {category.name}
      </Text>
    );
  }
  return (
    <View style={style.container}>
      {rootView}
      {topDivider}
      {firstView}
      {secondDivider}
      {secondView}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: MyColor.bg1,
    margin: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    // borderWidth: 1,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  subText: {
    color: MyColor.font1,
  },
});

export default CategoryBar;
