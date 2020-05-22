import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import {Button} from 'react-native-elements';
import ProgressBar from 'react-native-progress/Bar';

export default function ModalProgressBar({
  title,
  message,
  closeButtonTitle,
  processButtonTitle,
  visible,
  setVisible,
  progress,
  processCallback,
  isLoading,
  backButtonDisabled,
  backdropDisabled,
}) {
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      onBackButtonPress={() => {
        if (backButtonDisabled !== true) {
          setVisible(false);
        }
      }}
      onBackdropPress={() => {
        if (backdropDisabled !== true) {
          setVisible(false);
        }
      }}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
        </View>
        {message && <View style={styles.verticalSpacer} />}
        {message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.verticalSpacer} />
        {isLoading && <ActivityIndicator size="large" />}
        <ProgressBar progress={progress} width={null} />
        <View style={styles.verticalSpacer} />
        <View style={styles.buttonsContainer}>
          <Button
            title={closeButtonTitle}
            type="outline"
            onPress={() => setVisible(false)}
          />
          <Button
            title={processButtonTitle}
            type="outline"
            onPress={() => {
              processCallback && processCallback();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'white',
    opacity: 1.0,
    margin: 0,
    padding: 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
  message: {
    fontSize: 16,
  },
  verticalSpacer: {
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
