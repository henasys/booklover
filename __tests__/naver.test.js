import Naver from '../src/modules/Naver';

it('naver_isbn', async () => {
  const isbn = '9788984077843';
  const searcher = new Naver();
  const result = await searcher.searchIsbn(isbn);
  console.log('result', result);
  const link = result && result.items && result.items[0].link;
  const category = await searcher.getCategoryAndToc(link);
});
