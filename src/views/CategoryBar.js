import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function CategoryBar({stack, onPressTop, onPressSub = null}) {
  const rootView = (
    <Text style={style.text} onPress={onPressTop}>
      TOP
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
    backgroundColor: '#fff',
    padding: 0,
    margin: 0,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  subText: {
    color: 'navy',
  },
});

export default CategoryBar;
