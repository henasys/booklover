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

test('Database init', async () => {
  console.log('_realm.path', _realm.path);
  console.log('Database.getRealm().path', Database.getRealm().path);
});

// test('saveCategory', async () => {
//   await saveCategory();
//   const categoryList = db.getAccount();
//   console.log('categoryList', categoryList);
// });
