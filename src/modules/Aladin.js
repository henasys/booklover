import {REACT_APP_ALADIN_API_KEY} from 'react-native-dotenv';

class Aladin {
  constructor() {
    this.apiKey = REACT_APP_ALADIN_API_KEY;
  }

  getUrlForIsbn(p) {
    const itemIdType = p.isbn.length === 10 ? 'ISBN' : 'ISBN13';
    const isbn = encodeURI(p.isbn);
    return `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${
      p.ttbkey
    }&ItemId=${isbn}&itemIdType=${itemIdType}&output=${
      p.output
    }&Omitkey=1&Version=${
      p.version
    }&OptResult=c2binfo,fulldescription,toc,publisherFulldescription,ebookList,usedList,reviewList`;
  }

  searchIsbn(isbn) {
    const params = {
      ttbkey: this.apiKey,
      isbn: isbn,
      output: 'JS',
      version: '20131101', // 20131101, 20070901
    };
    const url = this.getUrlForIsbn(params);
    return this.fetch(url);
  }

  fetch(url) {
    return fetch(url);
  }
}

export default Aladin;
