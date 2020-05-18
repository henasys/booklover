import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import MyColor from '../modules/myColor';
import LocaleContext from '../modules/LocaleContext';

const getCount = (countList, categoryId) => {
  const countItem = countList.find(item => item.categoryId === categoryId);
  return countItem ? countItem.count : 0;
};

function CategoryBar({stack, countList, onPressTop, onPressSub = null}) {
  const {t} = React.useContext(LocaleContext);
  const rootView = (
    <Text style={style.text} onPress={onPressTop}>
      {t('CategoryBar.top')} ({getCount(countList, null)})
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
