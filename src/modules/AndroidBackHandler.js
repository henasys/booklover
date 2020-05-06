import {BackHandler} from 'react-native';

import {toast} from './toast';
import Navigator from './navigator';

export default class AndroidBackHandler {
  constructor() {
    this.backHandlerClickCount = 0;
    this.routes = [];
  }

  initBackHandler() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return this.handleBackButtonPress();
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

  handleBackButtonPress = () => {
    const currentRouteName = Navigator.routeNameRef.current;
    console.log('currentRouteName', currentRouteName);
    if (currentRouteName && !this.routes.includes(currentRouteName)) {
      console.log('The screen is not stopped with Back Button');
      return false;
    }

    this.backHandlerClickCount += 1;
    console.log('handleBackPress', this.backHandlerClickCount);
    if (this.backHandlerClickCount < 2) {
      const msg = '"뒤로" 버튼을 한 번 더 누르시면 앱이 종료됩니다.';
      toast(msg);
    } else {
      BackHandler.exitApp();
    }
    setTimeout(() => {
      this.backHandlerClickCount = 0;
    }, 2000);
    return true;
  };
}
