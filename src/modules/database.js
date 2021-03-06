import Realm from 'realm';
import 'react-native-get-random-values';
import {v1 as uuidv1} from 'uuid';

import {schemas} from '../modules/schemas';
import {Category, Book, Setting} from '../modules/schemas';
import Util from '../modules/util';
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

const realmToObject = (realmObject, schema) => {
  const object = {};
  const properties = Object.keys(schema.properties);
  for (var property of properties) {
    object[property] = realmObject[property];
  }
  return object;
};

const bookToObject = book => {
  return realmToObject(book, Book.schema);
};

const categoryToObject = category => {
  return realmToObject(category, Category.schema);
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
  const nameTrimmed = name.trim();
  const list = realm
    .objects('Category')
    .filtered(
      'name = $0 and level = $1 and parentId = $2',
      nameTrimmed,
      level,
      parentId,
    );
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        if (!list.isEmpty()) {
          resolve(list[0]);
          return;
        }
        const category = realm.create('Category', {
          id: uuidv1(),
          name: nameTrimmed,
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
  const categories = Util.splitCategoryName(categoryName);
  // console.log('saveCategoryName categories', categoryName, categories);
  let parentId = null;
  let category = null;
  for (let index = 0; index < categories.length; index++) {
    const name = categories[index];
    category = await saveCategoryOrGet(realm, {name, level: index, parentId});
    // console.log('saveCategoryName', category.name, category.level, category.id);
    parentId = category.id;
  }
  return category;
};

const getCategoryStackOnly2Level = (realm, categoryId, stack = []) => {
  if (stack.length >= 2) {
    return stack;
  }
  // const category = realm.objectForPrimaryKey('Category', categoryId);
  // if (!category) {
  //   return stack;
  // }
  const rs = getCategoryList(realm).filtered('id = $0', categoryId);
  if (rs.isEmpty()) {
    return stack;
  }
  const category = rs[0];
  stack.unshift(category);
  getCategoryStackOnly2Level(realm, category.parentId, stack);
  return stack;
};

const getCategoryListByParentId = (realm, parentId = null) => {
  const categoryList = getCategoryList(realm).filtered(
    'parentId = $0',
    parentId,
  );
  return categoryList;
};

const saveBook = (
  realm,
  {
    id = null,
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
    apiSource,
    created = null,
  },
) => {
  const published = TimeUtil.dateToTimestamp(pubDate);
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const book = realm.create('Book', {
          id: id ? id : uuidv1(),
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
          priceSales: Util.parseInteger(priceSales),
          priceStandard: Util.parseInteger(priceStandard),
          categoryName: categoryName,
          published: published,
          apiSource: apiSource,
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

const updateBook = (
  realm,
  {
    id,
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
    apiSource,
  },
) => {
  return new Promise((resolve, reject) => {
    const book = realm.objectForPrimaryKey('Book', id);
    if (!book) {
      const msg = `no book with id ${id}`;
      console.log(msg);
      reject(new Error(msg));
      return;
    }
    try {
      realm.write(() => {
        book.title = title;
        book.author = author;
        book.isbn = isbn;
        book.isbn13 = isbn13;
        book.publisher = publisher;
        book.link = link;
        book.cover = cover;
        book.pubDate = pubDate;
        book.description = description;
        book.toc = toc;
        book.priceSales = Util.parseInteger(priceSales);
        book.priceStandard = Util.parseInteger(priceStandard);
        book.categoryName = categoryName;
        book.category = category;
        book.published = TimeUtil.dateToTimestamp(pubDate);
        book.apiSource = apiSource;
        book.created = new Date().getTime();
        resolve(book);
      });
    } catch (e) {
      console.warn('realm.write', e);
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

const getBookListBySearch = (realm, text) => {
  let list = realm.objects('Book');
  if (text) {
    list = list.filtered('title CONTAINS[c] $0 or author CONTAINS[c] $0', text);
  }
  return list;
};

const getBookListByCategory = (realm, categoryId = null) => {
  if (categoryId) {
    return getBookList(realm).filtered('category.id = $0', categoryId);
  } else {
    return getBookList(realm).filtered(
      'category = $0 or category.id = $0',
      categoryId,
    );
  }
};

const getBookById = (realm, bookId) => {
  const rs = getBookList(realm).filtered('id = $0', bookId);
  if (rs.isEmpty()) {
    return null;
  }
  return rs[0];
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

const saveOrUpdateBook = async (
  realm,
  {
    id,
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
    apiSource,
  },
) => {
  const newCategory = await saveCategoryName(realm, categoryName);
  const lastCategory = categoryName
    ? newCategory
      ? newCategory
      : category
    : category;
  // console.log('lastCategory', lastCategory?.name);
  const book = id && realm.objectForPrimaryKey('Book', id);
  if (book) {
    return updateBook(realm, {
      id,
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
      category: lastCategory,
      apiSource,
    });
  } else {
    return saveBook(realm, {
      id,
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
      category: lastCategory,
      apiSource,
    });
  }
};

const saveSetting = (realm, {apiSource, language}) => {
  console.log('saveSetting', 'apiSource', apiSource, 'language', language);
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const rs = realm.objects('Setting');
        if (!rs.isEmpty()) {
          console.log('saveSetting rs is not empty');
          const setting = rs[0];
          if (apiSource) {
            setting.apiSource = apiSource;
          }
          if (language) {
            setting.language = language;
          }
          resolve(setting);
          return;
        }
        const setting = realm.create('Setting', {
          apiSource: apiSource,
          language: language,
        });
        console.log('saveSetting create done');
        resolve(setting);
      });
    } catch (e) {
      console.warn('realm.write', e);
      reject(new Error(e));
    }
  });
};

const getSetting = realm => {
  const apiSourceDefault = Setting.firstApiSource();
  const rs = realm.objects('Setting');
  if (rs.isEmpty()) {
    // console.log('getSetting is empty');
    return {
      apiSource: apiSourceDefault,
    };
  }
  // console.log('getSetting rs[0]', rs[0].apiSource);
  const setting = realmToObject(rs[0], Setting.schema);
  // console.log('getSetting realmToObject', setting);
  if (!setting.apiSource) {
    // console.log('getSetting apiSource is null', setting.apiSource);
    setting.apiSource = apiSourceDefault;
  }
  return setting;
};

const getBookCountByCategory = (realm, categoryId, countList = []) => {
  let count = 0;
  const categoryList = getCategoryListByParentId(realm, categoryId);
  categoryList.forEach(category => {
    const subCount = getBookCountByCategory(realm, category.id, countList);
    // console.log('subCount', subCount);
    count += subCount;
  });
  const bookList = getBookListByCategory(realm, categoryId);
  // console.log('bookCount', bookList.length);
  count += bookList.length;
  countList.push({categoryId, count});
  return count;
};

export default {
  Category,
  Book,
  Setting,
  newRealm,
  setRealm,
  getRealm,
  open,
  close,
  realmToObject,
  bookToObject,
  categoryToObject,
  clearAllDatabase,
  saveCategoryOrGet,
  getCategoryList,
  deleteCategoryAll,
  saveCategoryName,
  getCategoryStackOnly2Level,
  getCategoryListByParentId,
  saveBook,
  updateBook,
  getBookByIsbn,
  getBookList,
  getBookListBySearch,
  getBookListByCategory,
  getBookById,
  deleteBookById,
  saveOrUpdateBook,
  saveSetting,
  getSetting,
  getBookCountByCategory,
};
