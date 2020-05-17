import {BackHandler} from 'react-native';
import Toast from 'react-native-simple-toast';

import Navigator from './navigator';
import I18n from './i18n';

export default class AndroidBackHandler {
  constructor() {
    this.backHandlerClickCount = 0;
    this.routes = [];
  }

  initBackHandler(callback = null) {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return this.handleBackButtonPress(callback);
    });
  }

  removeBackHandler() {
    this.backHandler.remove();
  }

  addRouteToBeStopped(routeName) {
    if (this.routes.includes(routeName)) {
      return;
    }
    this.routes.push(routeName);
  }

  addRoutesToBeStopped(routes) {
    routes.forEach(element => {
      this.addRouteToBeStopped(element);
    });
  }

  handleBackButtonPress = (callback = null) => {
    const currentRouteName = Navigator.routeNameRef.current;
    console.log('currentRouteName', currentRouteName);
    if (currentRouteName && !this.routes.includes(currentRouteName)) {
      console.log('The screen is not stopped with Back Button');
      return false;
    }
    if (callback) {
      const result = callback();
      if (result) {
        return result;
      }
    }
    this.backHandlerClickCount += 1;
    console.log('handleBackPress', this.backHandlerClickCount);
    if (this.backHandlerClickCount < 2) {
      const msg = I18n.t('Misc.toastExitApplication');
      Toast.show(msg);
    } else {
      BackHandler.exitApp();
    }
    setTimeout(() => {
      this.backHandlerClickCount = 0;
    }, 2000);
    return true;
  };
}
