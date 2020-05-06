import {Alert} from 'react-native';

const showAlert = (title, message) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Ok',
      },
    ],
    {cancelable: true},
  );
};

const showTwoButtonAlert = (
  title,
  message,
  okCallback = null,
  cancelCallback = null,
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        onPress: () => {
          cancelCallback && cancelCallback();
        },
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          okCallback && okCallback();
        },
      },
    ],
    {cancelable: false},
  );
};

export default {showAlert, showTwoButtonAlert};
