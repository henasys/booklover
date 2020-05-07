import Realm from 'realm';
import 'react-native-get-random-values';
import {v1 as uuidv1} from 'uuid';

import {schemas} from '../modules/schemas';
import {Category, Book} from '../modules/schemas';
import {splitCategoryName} from '../modules/util';
import TimeUtil from '../modules/timeUtil';

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

const saveCategoryOrGet = (realm, {name, level, parentId = null}) => {
  const list = realm
    .objects('Category')
    .filtered('name = $0 and level = $1', name, level);
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        if (!list.isEmpty()) {
          resolve(list[0]);
          return;
        }
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

const saveCategoryName = async (realm, categoryName) => {
  const categories = splitCategoryName(categoryName);
  let parentId = null;
  let category = null;
  for (let index = 0; index < categories.length; index++) {
    const name = categories[index];
    category = await saveCategoryOrGet(realm, {name, level: index, parentId});
    parentId = category.id;
  }
  return category;
};

const saveBook = (
  realm,
  {
    title,
    author,
    isbn,
    isbn13,
    publisher,
    link,
    cover,
    pubDate,
    description,
    toc,
    priceSales,
    priceStandard,
    categoryName,
    category,
    created = null,
  },
) => {
  const priceSalesValue =
    typeof priceSales === 'string' ? parseInt(priceSales, 10) : priceSales;
  const priceStandardValue =
    typeof priceStandard === 'string'
      ? parseInt(priceStandard, 10)
      : priceStandard;
  const published = TimeUtil.dateToTimestamp(pubDate);
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const book = realm.create('Book', {
          id: uuidv1(),
          title: title,
          author: author,
          isbn: isbn,
          isbn13: isbn13,
          publisher: publisher,
          link: link,
          cover: cover,
          pubDate: pubDate,
          description: description,
          toc: toc,
          priceSales: priceSalesValue,
          priceStandard: priceStandardValue,
          categoryName: categoryName,
          published: published,
          created: created ? created : new Date().getTime(),
        });
        book.category = category;
        resolve(book);
      });
    } catch (e) {
      console.warn('realm.write at saveBook', e);
      reject(new Error(e));
    }
  });
};

const getBookByIsbn = (realm, isbn, isbn13) => {
  const rs = realm
    .objects('Book')
    .filtered('isbn = $0 or isbn13 = $1', isbn, isbn13);
  if (rs.isEmpty()) {
    return null;
  }
  return rs[0];
};

const getBookList = realm => {
  return realm.objects('Book');
};

const getBookListBySearch = (realm, text, sortField, sortReverse) => {
  let list = realm.objects('Book');
  if (text) {
    list = list.filtered('title CONTAINS[c] $0 or author CONTAINS[c] $0', text);
  }
  return list.sorted(sortField, sortReverse);
};

const deleteBookById = (realm, id) => {
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const book = realm.objects('Book').filtered('id = $0', id);
        realm.delete(book);
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
  saveCategoryOrGet,
  getCategoryList,
  deleteCategoryAll,
  saveCategoryName,
  saveBook,
  getBookByIsbn,
  getBookList,
  getBookListBySearch,
  deleteBookById,
};
