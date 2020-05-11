import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const checkPermission = (permission, callback = null) => {
  check(permission)
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          requestPermission(permission, callback);
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          callback && callback();
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    })
    .catch(e => {
      console.log(e);
    });
};

const requestPermission = (permission, callback = null) => {
  request(permission)
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          callback && callback();
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    })
    .catch(e => {
      console.log(e);
    });
};

const checkPermissionForWriteExternalStorage = (callback = null) => {
  checkPermission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, callback);
};

const checkPermissionForReadExternalStorage = (callback = null) => {
  checkPermission(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, callback);
};

const checkPermissionForCoarseLocation = (callback = null) => {
  checkPermission(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, callback);
};

const checkPermissionForFineLocation = (callback = null) => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  });
  checkPermission(permission, callback);
};

export default {
  checkPermission,
  requestPermission,
  checkPermissionForWriteExternalStorage,
  checkPermissionForReadExternalStorage,
  checkPermissionForCoarseLocation,
  checkPermissionForFineLocation,
};
