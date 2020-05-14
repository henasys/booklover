require('es6-promise').polyfill();
require('isomorphic-fetch');

import {REACT_APP_NAVER_CLIENT_ID} from 'react-native-dotenv';
import {REACT_APP_NAVER_CLIENT_SECRET} from 'react-native-dotenv';

const IsbnUtil = require('isbn-utils');

class Naver {
  constructor() {
    this.clientId = REACT_APP_NAVER_CLIENT_ID;
    this.clientSecret = REACT_APP_NAVER_CLIENT_SECRET;
  }

  getUrlForIsbn(p) {
    const isbn = encodeURI(p.isbn);
    return `https://openapi.naver.com/v1/search/book_adv.json?d_isbn=${isbn}`;
  }

  searchIsbn(isbn) {
    const params = {
      isbn: isbn,
    };
    const url = this.getUrlForIsbn(params);
    return this.fetch(url);
  }

  getUrlForKeyword(p) {
    const keyword = encodeURI(p.keyword);
    return `https://openapi.naver.com/v1/search/book.json?query=${keyword}&display=50`;
  }

  searchKeyword(keyword) {
    const params = {
      keyword: keyword,
    };
    const url = this.getUrlForKeyword(params);
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
    console.debug('fetch url', url);
    const headers = {
      'X-Naver-Client-Id': this.clientId,
      'X-Naver-Client-Secret': this.clientSecret,
    };
    return fetch(url, {headers: headers}).then(response => response.json());
  }
}

export default Naver;
