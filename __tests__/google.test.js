import Google from '../src/api/Google';

it('google_isbn', async () => {
  const isbn = '9780295986241';
  const searcher = new Google();
  const result = await searcher.searchIsbn(isbn);
  console.log('result', result);
});
