import * as React from 'react';

const isMountedRef = React.createRef();
const navigationRef = React.createRef();
const routeNameRef = React.createRef();

function navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

// Gets the current screen from navigation state
const getActiveRouteName = (_state = null) => {
  const state = _state !== null ? _state : getRootState();
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

const getRootState = () => {
  return navigationRef.current?.getRootState();
};

export default {
  isMountedRef,
  navigationRef,
  routeNameRef,
  navigate,
  getActiveRouteName,
  getRootState,
};
