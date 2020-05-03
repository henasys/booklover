import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from 'react-native-elements';

import Main from '../screens/Main';
import BarcodeScanner from '../screens/BarcodeScanner';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BarcodeScanner"
        component={BarcodeScanner}
        options={({navigation, route}) => ({
          title: '바코드 스캐너',
          headerRight: () => (
            <View style={styles.menuContainer}>
              <Icon
                iconStyle={styles.menuItem}
                onPress={() => navigation.navigate('Main')}
                name="playlist-edit"
                type="material-community"
              />
            </View>
          ),
        })}
      />
      <Stack.Screen name="Main" component={Main} options={{title: '메인'}} />
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
