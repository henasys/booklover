import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Input} from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import * as mime from 'react-native-mime-types';

const pickFile = async (type, setValue, setUri) => {
  try {
    const res = await DocumentPicker.pick({
      type: type,
    });
    console.log(
      res.uri,
      res.type, // mime type
      res.name,
      res.size,
    );
    setValue(res.name);
    setUri(res.uri);
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
      console.log('User cancelled the picker');
    } else {
      throw err;
    }
  }
};

PickFileInput.Type = {
  all: [DocumentPicker.types.allFiles],
  excel: [
    DocumentPicker.types.csv,
    'public.data',
    mime.lookup('xlsx'),
    mime.lookup('xls'),
  ],
  plainText: [DocumentPicker.types.plainText],
};

export default function PickFileInput({
  label,
  type,
  filename,
  setFilename,
  setUri,
}) {
  const onPress = () => {
    pickFile(type, setFilename, setUri)
      .then()
      .catch(e => {
        console.log('pickFile error', e);
      });
  };
  return (
    <View style={styles.container}>
      <Input
        containerStyle={styles.inputContainer}
        labelStyle={styles.label}
        disabledInputStyle={styles.disabledInput}
        defaultValue={filename}
        label={label}
        keyboardType="default"
        autoCapitalize="none"
        multiline={true}
        numberOfLines={1}
      />
      <TouchableOpacity style={styles.overlay} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    marginVertical: 5,
  },
  disabledInput: {
    color: 'black',
    opacity: 1,
  },
  label: {
    fontSize: 14,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity: 0,
  },
});
