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
  {index: 0, label: '제목 정렬'},
  {index: 1, label: '제목 역순'},
  {index: 2, label: '저자 정렬'},
  {index: 3, label: '저자 역순'},
  {index: 4, label: '입력일 정렬'},
  {index: 5, label: '입력일 역순'},
];

const renderMenuItem = (item, callback = null) => {
  return (
    <MenuItem
      onPress={() => {
        headerMenu.hide();
        callback && callback(item.index);
      }}>
      {item.label}
    </MenuItem>
  );
};

export const renderHeaderMenu = (callback = null) => {
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
      {items.map(item => renderMenuItem(item, callback))}
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  menuContainer: {
    flexDirection: 'row',
  },
  menuItem: {
    marginRight: 10,
  },
});
