import 'react-native-gesture-handler';
import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';

import Navigator from './src/modules/Navigator';
import MyStack from './src/screens/MyStack';

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={Navigator.navigationRef}
        onStateChange={state => {
          // console.log('New state is', state);
          const currentRouteName = Navigator.getActiveRouteName(state);
          Navigator.routeNameRef.current = currentRouteName;
          // console.log('currentRouteName', currentRouteName);
        }}>
        <MyStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
