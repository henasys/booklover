import React, {useState, useEffect} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';

const App = () => {
  const [url, setUrl] = useState(null);
  const handleUrl = event => {
    console.log('handleUrl', event);
    setUrl(event.url);
  };

  useEffect(() => {
    Linking.getInitialURL()
      .then(initialUrl => {
        console.log('getInitialURL', initialUrl);
        setUrl(initialUrl);
      })
      .catch(e => {
        console.log('getInitialURL error', e);
      });
    Linking.addEventListener('url', handleUrl);
    console.log('Linking.addEventListener');

    return () => {
      Linking.removeEventListener('url', handleUrl);
      console.log('Linking.removeEventListener');
    };
  }, []);
  return (
    <View style={styles.container}>
      <Text>{`The deep link is: ${url}`}</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
