import RNFS from 'react-native-fs';
// import {Platform} from 'react-native';

const getExternalStorage = () => {
  // return RNFS.ExternalDirectoryPath;
  return RNFS.ExternalStorageDirectoryPath;
};

const readDirExternalStorage = () => {
  const dir = getExternalStorage();
  return RNFS.readDir(dir);
};

const getBookLoverFolder = () => {
  return 'BookLover';
};

const getBookLoverPath = (fileName = null) => {
  const rootDir = getExternalStorage();
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

const readBookLoverPath = (filename, encoding = 'utf8') => {
  const path = getExternalStorage() + '/' + filename;
  return RNFS.readFile(path, encoding);
};

export default {
  getExternalStorage,
  readDirExternalStorage,
  getBookLoverFolder,
  getBookLoverPath,
  readDirBookLoverPath,
  writeBookLoverPath,
  readBookLoverPath,
};
