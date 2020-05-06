/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {FloatingAction} from 'react-native-floating-action';
import Aladin from '../modules/Aladin';

const actions = [
  {
    text: 'Accessibility',
    icon: <Icon name="md-create" />,
    name: 'bt_accessibility',
    position: 2,
  },
  {
    text: 'Language',
    icon: <Icon name="md-create" />,
    name: 'bt_language',
    position: 1,
  },
  {
    text: 'Location',
    icon: <Icon name="md-create" />,
    name: 'bt_room',
    position: 3,
  },
  {
    text: 'Video',
    icon: <Icon name="md-create" />,
    name: 'bt_videocam',
    position: 4,
  },
];

function Main() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Main Screen</Text>
      <FloatingAction
        actions={actions}
        position="right"
        onPressItem={name => {
          alert('Icon pressed', `the icon ${name} was pressed`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default Main;
