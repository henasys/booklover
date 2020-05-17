import React from 'react';
import {StyleSheet} from 'react-native';
import Menu, {MenuItem} from 'react-native-material-menu';
import {Icon} from 'react-native-elements';

import LocaleContext from '../modules/LocaleContext';

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
  {index: 0, label: 'title', field: 'title', reverse: false},
  {index: 1, label: 'titleReverse', field: 'title', reverse: true},
  {index: 2, label: 'author', field: 'author', reverse: false},
  {index: 3, label: 'authorReverse', field: 'author', reverse: true},
  {index: 4, label: 'date', field: 'created', reverse: false},
  {index: 5, label: 'dateReverse', field: 'created', reverse: true},
];

items.getItem = index => {
  return items[index];
};

const renderMenuItem = (t, item, sort, callback = null) => {
  const textStyle = sort === item.index ? {color: 'blue'} : null;
  const label = t('HeaderMenu.' + item.label);
  return (
    <MenuItem
      key={item.index}
      textStyle={textStyle}
      onPress={() => {
        headerMenu.hide();
        callback && callback(item.index);
      }}>
      {label}
    </MenuItem>
  );
};

const renderHeaderMenu = (t, sort, callback = null) => {
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
      {items.map(item => renderMenuItem(t, item, sort, callback))}
    </Menu>
  );
};

export default function HeaderMenu({sort, callback}) {
  const {t} = React.useContext(LocaleContext);
  return renderHeaderMenu(t, sort, callback);
}

HeaderMenu.items = items;

const styles = StyleSheet.create({
  menuItem: {
    marginRight: 10,
  },
});
