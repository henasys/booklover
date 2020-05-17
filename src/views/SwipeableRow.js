/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Animated, StyleSheet, Text, View, I18nManager} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import LocaleContext from '../modules/LocaleContext';
import MyAlert from '../views/alert';

const buttonWidth = 70;
const rightButtonCount = 1;

export default class SwipeableRow extends Component {
  static contextType = LocaleContext;

  constructor(props) {
    super(props);
    // console.log('props.rowItem', props.rowItem);
  }
  renderRightAction = (text, color, x, progress, callback = null) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      this.close();
      callback && callback();
    };
    return (
      <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
        <RectButton
          style={[styles.rightAction, {backgroundColor: color}]}
          onPress={pressHandler}>
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  renderRightActions = progress => {
    const {t} = this.context;
    return (
      <View
        style={{
          width: buttonWidth * rightButtonCount,
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}>
        {this.renderRightAction(
          t('SwipeableRow.actionTitle'),
          '#dd2c00',
          buttonWidth,
          progress,
          () => {
            const title = t('SwipeableRow.alertTitle');
            const message = this.props.rowItem.title;
            const okCallback = () => {
              this.props.onDeleteRow &&
                this.props.onDeleteRow(this.props.rowKey);
            };
            const cancelCallback = () => {};
            MyAlert.showTwoButtonAlert(
              title,
              message,
              okCallback,
              cancelCallback,
            );
          },
        )}
      </View>
    );
  };
  updateRef = ref => {
    this._swipeableRow = ref;
  };
  close = () => {
    this._swipeableRow.close();
  };
  render() {
    const {children} = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        renderRightActions={this.renderRightActions.bind(this)}>
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#388e3c',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
