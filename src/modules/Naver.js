require('es6-promise').polyfill();
require('isomorphic-fetch');

import {REACT_APP_NAVER_CLIENT_ID} from 'react-native-dotenv';
import {REACT_APP_NAVER_CLIENT_SECRET} from 'react-native-dotenv';
import {parse} from 'node-html-parser';

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
    return this.fetch(url).then(async response => {
      const book = response && response.items && response.items[0];
      if (!book) {
        return response;
      }
      const catAndToc = await this.getCategoryAndToc(book.link);
      book.cover = book.image;
      book.priceStandard =
        typeof book.price === 'number' ? book.price : parseInt(book.price, 10);
      book.priceSales =
        typeof book.discount === 'number'
          ? book.discount
          : parseInt(book.discount, 10);
      book.categoryName = catAndToc.category;
      book.toc = catAndToc.toc;
      response.items[0] = book;
      return response;
    });
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

  async getCategoryAndToc(link) {
    const content = await fetch(link).then(response => response.text());
    const root = parse(content);
    const toc = root.querySelector('#tableOfContentsContent');
    console.log('toc', toc.innerHTML);
    const cat_1 = root.querySelector('#category_location1_depth');
    console.log('cat_1', cat_1.innerHTML);
    const cat_2 = root.querySelector('#category_location2_depth');
    const cat_3 = root.querySelector('#category_location3_depth');
    const cat_4 = root.querySelector('#category_location4_depth');
    const categoryList = [];
    if (cat_1) {
      categoryList.push(cat_1.text);
    }
    if (cat_2) {
      categoryList.push(cat_2.text);
    }
    if (cat_3) {
      categoryList.push(cat_3.text);
    }
    if (cat_4) {
      categoryList.push(cat_4.text);
    }
    return {toc: toc.innerHTML, category: categoryList.join('>')};
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
