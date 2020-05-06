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
      <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
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
