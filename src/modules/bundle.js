import XLSX from 'xlsx';

import Database from '../modules/database';
import Util from '../modules/util';

const excelHeader = [
  'id',
  'title',
  'author',
  'isbn',
  'isbn13',
  'publisher',
  'link',
  'cover',
  'pubDate',
  'description',
  'toc',
  'priceSales',
  'priceStandard',
  'categoryName',
];

const excelDataRow = book => {
  return [
    book.id,
    book.title,
    book.author,
    book.isbn,
    book.isbn13,
    book.publisher,
    book.link,
    book.cover,
    book.pubDate,
    book.description,
    book.toc,
    book.priceSales,
    book.priceStandard,
    book.categoryName,
  ];
};

const excelData = realm => {
  const list = Database.getBookList(realm);
  const data = [];
  data.push(excelHeader);
  list.forEach(book => {
    const row = excelDataRow(book);
    data.push(row);
  });
  return data;
};

const makeExcel = data => {
  var ws_name = 'Sheet';
  var ws = XLSX.utils.aoa_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  return XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
};

const bundleBooListkExcel = realm => {
  return makeExcel(excelData(realm));
};

const bundleBookListJson = realm => {
  const list = Database.getBookList(realm).map(b => Database.bookToObject(b));
  return JSON.stringify(list);
};

const bundleBookList = (realm, fileName) => {
  const ext = Util.getExtension(fileName);
  if (ext === 'xlsx') {
    return bundleBooListkExcel(realm);
  } else {
    return bundleBookListJson(realm);
  }
};

export default {bundleBooListkExcel, bundleBookListJson, bundleBookList};
