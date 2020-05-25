import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

// ios only
const getMainBundle = () => {
  return RNFS.MainBundlePath;
};

const readDirMainBundle = () => {
  const dir = getMainBundle();
  return RNFS.readDir(dir);
};

const getDocumentDirectory = () => {
  return RNFS.DocumentDirectoryPath;
};

const readDirDocumentDirectory = () => {
  const dir = getDocumentDirectory();
  return RNFS.readDir(dir);
};

// android only
const getExternalStorage = () => {
  // return RNFS.ExternalDirectoryPath;
  return RNFS.ExternalStorageDirectoryPath;
};

const getDownloadDirectory = () => {
  return RNFS.DownloadDirectoryPath;
};

const readDirExternalStorage = () => {
  const dir = getExternalStorage();
  return RNFS.readDir(dir);
};

const getBookLoverFolder = () => {
  return 'BookLover';
};

const getBookLoverPath = (fileName = null) => {
  const rootDir =
    Platform.OS === 'ios' ? getDocumentDirectory() : getDownloadDirectory();
  const folerName = getBookLoverFolder();
  const base = `${rootDir}/${folerName}`;
  if (fileName) {
    return `${base}/${fileName}`;
  } else {
    return base;
  }
};

const readDirBookLoverPath = () => {
  const dir = getBookLoverPath();
  return RNFS.readDir(dir);
};

const writeBookLoverPath = (fileName, contents, encoding = 'utf8') => {
  const base = getBookLoverPath();
  const path = getBookLoverPath(fileName);
  console.log('base', base);
  console.log('path', path);
  return RNFS.mkdir(base).then(() => RNFS.writeFile(path, contents, encoding));
};

const readBookLoverPath = (fileName, encoding = 'utf8') => {
  const path = getBookLoverPath(fileName);
  return RNFS.readFile(path, encoding);
};

const existsBookLoverPath = fileName => {
  const path = getBookLoverPath(fileName);
  return RNFS.exists(path);
};

const readFile = (path, encodingOrOptions = null) => {
  return RNFS.readFile(path, encodingOrOptions);
};

export default {
  getMainBundle,
  readDirMainBundle,
  getDocumentDirectory,
  readDirDocumentDirectory,
  getExternalStorage,
  getDownloadDirectory,
  readDirExternalStorage,
  getBookLoverFolder,
  getBookLoverPath,
  readDirBookLoverPath,
  writeBookLoverPath,
  readBookLoverPath,
  existsBookLoverPath,
  readFile,
};
