export class Category {}

Category.schema = {
  name: 'Category',
  primaryKey: 'id',
  properties: {
    id: {type: 'string'},
    parentId: {type: 'string', indexed: true, optional: true},
    name: {type: 'string', indexed: true},
    level: {type: 'int', indexed: true},
  },
};

export class Book {}

Book.schema0 = {
  name: 'Book',
  primaryKey: 'id',
  properties: {
    id: {type: 'string'},
    title: {type: 'string', indexed: true},
    author: {type: 'string', indexed: true, optional: true},
    isbn: {type: 'string', indexed: true, optional: true},
    isbn13: {type: 'string', indexed: true, optional: true},
    publisher: {type: 'string', indexed: true, optional: true},
    link: {type: 'string', indexed: true, optional: true},
    cover: {type: 'string', indexed: true, optional: true},
    pubDate: {type: 'string', indexed: true, optional: true},
    description: {type: 'string', indexed: true, optional: true},
    toc: {type: 'string', indexed: true, optional: true},
    priceSales: {type: 'int', indexed: true, optional: true},
    priceStandard: {type: 'int', indexed: true, optional: true},
    categoryName: {type: 'string', indexed: true, optional: true},
    category: {type: 'Category', optional: true},
    published: {type: 'int', indexed: true, optional: true},
    created: {type: 'int', indexed: true},
  },
};

Book.schema = {
  name: 'Book',
  primaryKey: 'id',
  properties: {
    id: {type: 'string'},
    title: {type: 'string', indexed: true},
    author: {type: 'string', indexed: true, optional: true},
    isbn: {type: 'string', indexed: true, optional: true},
    isbn13: {type: 'string', indexed: true, optional: true},
    publisher: {type: 'string', indexed: true, optional: true},
    link: {type: 'string', indexed: true, optional: true},
    cover: {type: 'string', indexed: true, optional: true},
    pubDate: {type: 'string', indexed: true, optional: true},
    description: {type: 'string', indexed: true, optional: true},
    toc: {type: 'string', indexed: true, optional: true},
    priceSales: {type: 'int', indexed: true, optional: true},
    priceStandard: {type: 'int', indexed: true, optional: true},
    categoryName: {type: 'string', indexed: true, optional: true},
    category: {type: 'Category', optional: true},
    published: {type: 'int', indexed: true, optional: true},
    apiSource: {type: 'string', optional: true},
    created: {type: 'int', indexed: true},
  },
};

export class Setting {}

Setting.schema = {
  name: 'Setting',
  properties: {
    apiSource: {type: 'string', optional: true},
  },
};

Setting.apiSourceType = {
  ALADIN: 'ALADIN',
  NAVER: 'NAVER',
};

Setting.findIndexByApiSource = apiSource => {
  if (!apiSource) {
    return 0;
  }
  const keys = Object.keys(Setting.apiSourceType);
  return keys.findIndex(item => item === apiSource);
};

const schema0 = [Category, Book.schema0];
const schema1 = [Category, Book, Setting];

function migrationFunctionNothing(oldRealm, newRealm) {
  console.log('migrationFunctionNothing', oldRealm, newRealm);
  console.log('oldRealm.schemaVersion', oldRealm.schemaVersion);
  console.log('newRealm.schemaVersion', newRealm.schemaVersion);
}

export const schemas = [
  {
    schema: schema0,
    schemaVersion: 0,
    migration: migrationFunctionNothing,
  },
  {
    schema: schema1,
    schemaVersion: 1,
    migration: migrationFunctionNothing,
  },
];

schemas.getConfig = index => {
  const config = schemas[index];
  return config;
};

schemas.getLatestConfig = () => {
  return schemas.getConfig(schemas.length - 1);
};
