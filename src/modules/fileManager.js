import RNFS from 'react-native-fs';
// import {Platform} from 'react-native';

const getExternalDirectory = () => {
  return RNFS.ExternalStorageDirectoryPath;
};

const readExternalDirectory = () => {
  const dir = getExternalDirectory();
  return RNFS.readDir(dir);
};

const writeToExternalDirectory = (filename, contents, encoding = 'utf8') => {
  const path = getExternalDirectory() + '/' + filename;
  return RNFS.writeFile(path, contents, encoding);
};

const readFromExternalDirectory = (filename, encoding = 'utf8') => {
  const path = getExternalDirectory() + '/' + filename;
  return RNFS.readFile(path, encoding);
};

export default {
  getExternalDirectory,
  readExternalDirectory,
  writeToExternalDirectory,
  readFromExternalDirectory,
};
