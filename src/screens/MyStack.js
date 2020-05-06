import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from 'react-native-elements';

import Main from '../screens/Main';
import BarcodeScanner from '../screens/BarcodeScanner';
import Database from '../modules/database';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator initialRouteName={'Main'}>
      <Stack.Screen
        name="BarcodeScanner"
        component={BarcodeScanner}
        options={({navigation, route}) => ({
          title: '바코드 스캐너',
        })}
      />
      <Stack.Screen
        name="Main"
        component={Main}
        options={({navigation, route}) => ({
          title: '메인',
          headerRight: () => (
            <View style={styles.menuContainer}>
              <Icon
                iconStyle={styles.menuItem}
                onPress={() => {
                  Database.clearAllDatabase();
                }}
                name="delete"
                type="material-community"
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
  },
  menuItem: {
    marginRight: 10,
  },
});
