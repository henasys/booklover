import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from 'react-native-elements';

import LocaleContext from '../modules/LocaleContext';

import Main from '../screens/Main';
import Detail from '../screens/Detail';
import BarcodeAdd from '../screens/BarcodeAdd';
import SearchAdd from '../screens/SearchAdd';
import Edit from '../screens/Edit';
import Setting from '../screens/Setting';
import Backup from '../screens/Backup';
import ImportIsbn from '../screens/ImportIsbn';

const Stack = createStackNavigator();

export default function MyStack() {
  const {t} = React.useContext(LocaleContext);
  return (
    <Stack.Navigator initialRouteName={'Main'}>
      <Stack.Screen
        name="Main"
        component={Main}
        options={({navigation, route}) => ({
          title: t('Main.title'),
        })}
      />
      <Stack.Screen
        name="BarcodeAdd"
        component={BarcodeAdd}
        options={({navigation, route}) => ({
          title: t('BarcodeAdd.title'),
        })}
      />
      <Stack.Screen
        name="SearchAdd"
        component={SearchAdd}
        options={({navigation, route}) => ({
          title: t('SearchAdd.title'),
        })}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={({navigation, route}) => ({
          title: t('Detail.title'),
        })}
      />
      <Stack.Screen name="Edit" component={Edit} />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={({navigation, route}) => ({
          title: t('Setting.title'),
        })}
      />
      <Stack.Screen
        name="Backup"
        component={Backup}
        options={({navigation, route}) => ({
          title: t('Backup.title'),
        })}
      />
      <Stack.Screen
        name="ImportIsbn"
        component={ImportIsbn}
        options={({navigation, route}) => ({
          title: t('ImportIsbn.title'),
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
