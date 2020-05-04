/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Button} from 'react-native';

import Aladin from '../modules/Aladin';

function Main() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Main Screen</Text>
      <Button
        title="search ISBN"
        onPress={() => {
          // const isbn = 'K882531540';
          const isbn = '9788936438128';
          const searcher = new Aladin();
          searcher
            .searchIsbn(isbn)
            .then(response => response.json())
            .then(response => {
              console.log('searchIsbn response', JSON.stringify(response));
            })
            .catch(e => {
              console.log('searchIsbn error', e);
            });
        }}
      />
    </View>
  );
}

export default Main;
