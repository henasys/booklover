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

  search(keyword) {
    const checkIsbn = IsbnUtil.parse(keyword);
    if (checkIsbn) {
      return this.searchIsbn(keyword);
    } else {
      return this.searchKeyword(keyword);
    }
  }

  searchIsbn(isbn) {
    const params = {
      isbn: isbn,
    };
    const url = this._getUrlForIsbn(params);
    return this._fetch(url);
  }

  searchKeyword(keyword) {
    const params = {
      keyword: keyword,
    };
    const url = this._getUrlForKeyword(params);
    return this._fetch(url);
  }

  _getUrlForIsbn(p) {
    const isbn = encodeURI(p.isbn);
    return `https://openapi.naver.com/v1/search/book_adv.json?d_isbn=${isbn}`;
  }

  _getUrlForKeyword(p) {
    const keyword = encodeURI(p.keyword);
    return `https://openapi.naver.com/v1/search/book.json?query=${keyword}&display=50`;
  }

  addTocAndCategoryName(book) {
    return new Promise((resolve, reject) => {
      fetch(book.link)
        .then(response => response.text())
        .then(html => {
          const root = parse(html);
          const tocEleement = root.querySelector('#tableOfContentsContent');
          book.toc = tocEleement && tocEleement.innerHTML;
          book.categoryName = this._getCategoryName(root);
          resolve(book);
        })
        .catch(e => {
          reject(new Error(e));
        });
    });
  }

  _getCategoryName(root) {
    const categoryList = [];
    for (let index = 1; index <= 4; index++) {
      const categoryElement = this._getCategoryElement(root, index);
      if (categoryElement && categoryElement.text) {
        categoryList.push(categoryElement.text);
      }
    }
    if (categoryList.length === 0) {
      return null;
    } else {
      return categoryList.join('>');
    }
  }

  _getCategoryElement(root, number) {
    const selector = `#category_location${String(number)}_depth`;
    return root.querySelector(selector);
  }

  _getBooks(response) {
    return response && response.items;
  }

  _mapping(books) {
    if (!books || !Array.isArray(books)) {
      return books;
    }
    books.forEach(book => {
      const [isbn, isbn13] = this._splitIsbn(book.isbn);
      book.isbn = isbn;
      book.isbn13 = isbn13;
      book.cover = book.image;
      book.priceStandard = parseInt(book.price, 10);
      book.priceSales = parseInt(book.discount, 10);
    });
    return books;
  }

  _splitIsbn(isbn) {
    const trimmed = isbn.trim();
    if (!trimmed) {
      return [null, null];
    }
    const list = trimmed.split(' ');
    if (list.length === 2) {
      return list;
    }
    if (list.length === 1) {
      const isbnOne = list[0];
      if (isbnOne.length === 10) {
        return [isbnOne, null];
      } else {
        return [null, isbnOne];
      }
    } else {
      return [null, null];
    }
  }

  _fetch(url) {
    console.debug('fetch url', url);
    const headers = {
      'X-Naver-Client-Id': this.clientId,
      'X-Naver-Client-Secret': this.clientSecret,
    };
    return fetch(url, {headers: headers})
      .then(response => response.json())
      .then(response => this._getBooks(response))
      .then(books => this._mapping(books));
  }
}

export default Naver;
