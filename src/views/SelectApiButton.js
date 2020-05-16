import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

import Database from '../modules/database';
import MyColor from '../modules/myColor';

export default function SelectApiButton({apiSource, onValueChanged}) {
  const index = Database.Setting.findIndexByApiSource(apiSource);
  return (
    <TouchableOpacity
      style={styles.buttonStyle}
      onPress={() => {
        const keys = Object.keys(Database.Setting.apiSourceType);
        const nextIndex = (index + 1) % keys.length;
        const keyValue = keys[nextIndex];
        console.log('SelectApiButton', index, nextIndex, keyValue);
        onValueChanged && onValueChanged(keyValue);
      }}>
      <Text style={styles.titleStyle}>{apiSource}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    borderColor: MyColor.black,
    backgroundColor: MyColor.bg1,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 4,
  },
  titleStyle: {
    color: MyColor.black,
    fontWeight: 'bold',
  },
});
