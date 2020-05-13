import {REACT_APP_ALADIN_API_KEY} from 'react-native-dotenv';

const parseString = require('react-native-xml2js').parseString;
const IsbnUtil = require('isbn-utils');

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
      output: 'XML',
      version: '20070901', // 20131101, 20070901
    };
    const url = this.getUrlForIsbn(params);
    // console.log('searchIsbn url', url);
    return this.fetch(url);
  }

  getUrlForKeyword(p) {
    const keyword = encodeURI(p.keyword);
    return `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${
      p.ttbkey
    }&Query=${keyword}&QueryType=Keyword&SearchTarget=Book&output=${
      p.output
    }&Omitkey=1&Version=${
      p.version
    }&OptResult=c2binfo,fulldescription,toc&MaxResults=50`;
  }

  searchKeyword(keyword) {
    const params = {
      ttbkey: this.apiKey,
      keyword: keyword,
      output: 'XML',
      version: '20070901', // 20131101, 20070901
    };
    const url = this.getUrlForKeyword(params);
    // console.log('searchKeyword url', url);
    return this.fetch(url);
  }

  search(keyword) {
    const checkIsbn = IsbnUtil.parse(keyword);
    if (checkIsbn) {
      return this.searchIsbn(keyword);
    } else {
      return this.searchKeyword(keyword);
    }
  }

  fetch(url) {
    return fetch(url)
      .then(response => response.text())
      .then(response => {
        // console.log('response.text', response);
        return new Promise((resolve, reject) => {
          const options = {explicitArray: false, explicitRoot: false};
          parseString(response, options, function(err, result) {
            if (err) {
              reject(new Error(err));
              return;
            }
            resolve(result);
          });
        });
      });
  }
}

export default Aladin;
