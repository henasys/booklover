require('es6-promise').polyfill();
require('isomorphic-fetch');

import Naver from '../src/api/Naver';

it('naver_isbn', async () => {
  const isbn = '9788984077843';
  const searcher = new Naver();
  let books = await searcher.searchIsbn(isbn);
  console.log('books', books);
  const newBook = await searcher.addTocAndCategoryName(books[0]);
  console.log('newBook', newBook);
});

// 9788953527058
it('naver_isbn_error', async () => {
  const isbn = '9788953527058';
  const searcher = new Naver();
  let books = await searcher.searchIsbn(isbn);
  console.log('books', books);
  const newBook = await searcher.addTocAndCategoryName(books[0]);
  console.log('newBook', newBook);
});
