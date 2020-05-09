import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from 'react-native-elements';

import Main from '../screens/Main';
import Detail from '../screens/Detail';
import BarcodeAdd from '../screens/BarcodeAdd';
import SearchAdd from '../screens/SearchAdd';
import Edit from '../screens/Edit';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator initialRouteName={'Main'}>
      <Stack.Screen
        name="BarcodeAdd"
        component={BarcodeAdd}
        options={({navigation, route}) => ({
          title: '바코드 검색 추가 ',
        })}
      />
      <Stack.Screen
        name="Main"
        component={Main}
        options={({navigation, route}) => ({
          title: '책사랑꾼',
        })}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={({navigation, route}) => ({
          title: '상세 정보',
        })}
      />
      <Stack.Screen
        name="SearchAdd"
        component={SearchAdd}
        options={({navigation, route}) => ({
          title: '제목 검색 추가',
        })}
      />
      <Stack.Screen
        name="Edit"
        component={Edit}
        options={({navigation, route}) => ({
          title: '직접 입력 추가',
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
