import Naver from '../src/modules/Naver';

it('naver_isbn', async () => {
  const isbn = '9788984077843';
  const searcher = new Naver();
  let books = await searcher.searchIsbn(isbn);
  console.log('books', books);
  const newBook = await searcher.addTocAndCategoryName(books[0]);
  console.log('newBook', newBook);
});
