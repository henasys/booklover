import Realm from 'realm';
import 'react-native-get-random-values';
import {v1 as uuidv1} from 'uuid';

import {schemas} from '../modules/schemas';
import {Category, Book} from '../modules/schemas';

let _realm = null;

const newRealm = config => {
  return new Realm(config);
};

const setRealm = realm => {
  _realm = realm;
  console.log('setRealm', realm.schemaVersion);
};

const getRealm = () => {
  return _realm;
};

const open = handler => {
  migrate();
  Realm.open(schemas.getLatestConfig())
    .then(realm => {
      handler && handler(realm);
    })
    .catch(e => {
      console.warn('Realm.open', e);
    });
};

const close = realm => {
  if (realm !== null && !realm.isClosed) {
    realm.close();
    // console.log('realm.close() done');
  }
};

const migrate = () => {
  const currentVersion = Realm.schemaVersion(Realm.defaultPath);
  const latestVersion = schemas.getLatestConfig().schemaVersion;
  if (currentVersion === -1) {
    return;
  }
  const goOrNot = currentVersion < latestVersion;
  if (!goOrNot) {
    return;
  }
  console.log('migrate start', goOrNot);
  console.log('currentVersion', currentVersion);
  console.log('latestVersion', latestVersion);
  let nextSchemaIndex = 0;
  while (nextSchemaIndex < schemas.length) {
    const config = schemas.getConfig(nextSchemaIndex);
    console.log('migrate config', nextSchemaIndex, config.schemaVersion);
    if (config.schemaVersion >= currentVersion) {
      let migratedRealm = null;
      try {
        migratedRealm = new Realm(config);
      } catch (e) {
        console.warn(e);
      } finally {
        if (migratedRealm) {
          migratedRealm.close();
        }
      }
    } else {
      console.log(
        'config.schemaVersion < currentVersion',
        config.schemaVersion,
        currentVersion,
      );
    }
    nextSchemaIndex += 1;
  }
};

const clearAllDatabase = () => {
  return new Promise((resolve, reject) => {
    Realm.open(schemas.getLatestConfig())
      .then(realm => {
        try {
          realm.write(() => {
            realm.deleteAll();
            console.log('realm.deleteAll()');
            resolve();
          });
        } catch (e) {
          console.warn('realm.write', e);
          reject(new Error(e));
        }
      })
      .catch(e => {
        console.warn('Realm.open', e);
        reject(new Error(e));
      });
  });
};

const saveCategory = (realm, name, level, parentId = null) => {
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const category = realm.create('Category', {
          id: uuidv1(),
          name: name,
          level: level,
          parentId: parentId,
        });
        resolve(category);
      });
    } catch (e) {
      console.warn('realm.write', e);
      reject(new Error(e));
    }
  });
};

const getCategoryList = realm => {
  return realm.objects('Category');
};

const deleteCategoryAll = realm => {
  const list = realm.objects('Category');
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        realm.delete(list);
        resolve();
      });
    } catch (e) {
      console.warn('realm.write', e);
      reject(new Error(e));
    }
  });
};

export default {
  Category,
  Book,
  newRealm,
  setRealm,
  getRealm,
  open,
  close,
  clearAllDatabase,
  saveCategory,
  getCategoryList,
  deleteCategoryAll,
};
