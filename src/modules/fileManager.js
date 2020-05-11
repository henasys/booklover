import RNFS from 'react-native-fs';
// import {Platform} from 'react-native';

const getExternalStorage = () => {
  return RNFS.ExternalStorageDirectoryPath;
};

const readExternalStorage = () => {
  const dir = getExternalStorage();
  return RNFS.readDir(dir);
};

const writeToExternalStorage = (filename, contents, encoding = 'utf8') => {
  const path = getExternalStorage() + '/' + filename;
  return RNFS.writeFile(path, contents, encoding);
};

const readFromExternalStorage = (filename, encoding = 'utf8') => {
  const path = getExternalStorage() + '/' + filename;
  return RNFS.readFile(path, encoding);
};

export default {
  getExternalStorage,
  readExternalStorage,
  writeToExternalStorage,
  readFromExternalStorage,
};
