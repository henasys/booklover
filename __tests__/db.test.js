import {schemas} from '../src/modules/schemas';
import Database from '../src/modules/database';

let _realm = null;

function initializeDatabase() {
  const config = {...schemas.getLatestConfig()};
  config.inMemory = true;
  config.path = 'default.realm.inMemory';
  console.log('config', config);
  _realm = Database.newRealm(config);
  Database.setRealm(_realm);
  console.log('_realm', _realm);
}

async function clearDatabase() {
  await Database.clearAllDatabase();
}

beforeEach(() => {
  initializeDatabase();
});

afterEach(async () => {
  await clearDatabase();
});

// test('Database init', async () => {
//   console.log('_realm.path', _realm.path);
//   console.log('Database.getRealm().path', Database.getRealm().path);
// });

test('saveCategoryName', async () => {
  const categoryName = '국내도서>사회과학>사회학>사회학 일반';
  const result = await Database.saveCategoryName(_realm, categoryName);
  console.log('result', result.id, result.name, result.level);
  const categoryList = Database.getCategoryList(_realm);
  console.log('categoryList', categoryList);
  categoryList.forEach(cat => {
    console.log(cat.id, cat.parentId, cat.name, cat.level);
  });
});

test('saveMultiCategoryName', async () => {
  const cat1 = '국내도서>경제경영>기업 경영>경영 일반';
  const cat2 = '국내도서>경제경영>기업 경영>서비스/고객관리';
  await Database.saveCategoryName(_realm, cat1);
  let categoryList = Database.getCategoryList(_realm);
  console.log('categoryList', categoryList);
  categoryList.forEach(cat => {
    console.log(cat.id, cat.parentId, cat.name, cat.level);
  });
  await Database.saveCategoryName(_realm, cat2);
  categoryList = Database.getCategoryList(_realm);
  console.log('categoryList', categoryList);
  categoryList.forEach(cat => {
    console.log(cat.id, cat.parentId, cat.name, cat.level);
  });
});
