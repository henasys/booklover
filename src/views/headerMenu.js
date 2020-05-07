import React from 'react';
import {StyleSheet} from 'react-native';
import Menu, {MenuItem} from 'react-native-material-menu';
import {Icon} from 'react-native-elements';

const headerMenu = {_menu: null};

headerMenu.setMenuRef = ref => {
  headerMenu._menu = ref;
};

headerMenu.hide = () => {
  headerMenu._menu.hide();
};

headerMenu.show = () => {
  headerMenu._menu.show();
};

const items = [
  {index: 0, label: '제목 정렬', field: 'title', reverse: false},
  {index: 1, label: '제목 역순', field: 'title', reverse: true},
  {index: 2, label: '저자 정렬', field: 'author', reverse: false},
  {index: 3, label: '저자 역순', field: 'author', reverse: true},
  {index: 4, label: '입력일 정렬', field: 'created', reverse: false},
  {index: 5, label: '입력일 역순', field: 'created', reverse: true},
];

items.getItem = index => {
  return items[index];
};

const renderMenuItem = (item, sort, callback = null) => {
  const textStyle = sort === item.index ? {color: 'blue'} : null;
  return (
    <MenuItem
      key={item.index}
      textStyle={textStyle}
      onPress={() => {
        headerMenu.hide();
        callback && callback(item.index);
      }}>
      {item.label}
    </MenuItem>
  );
};

const renderHeaderMenu = (sort, callback = null) => {
  return (
    <Menu
      ref={headerMenu.setMenuRef}
      button={
        <Icon
          iconStyle={styles.menuItem}
          onPress={headerMenu.show}
          name="sort"
          type="material-community"
        />
      }>
      {items.map(item => renderMenuItem(item, sort, callback))}
    </Menu>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    marginRight: 10,
  },
});

export default {
  items,
  renderHeaderMenu,
};
