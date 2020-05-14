require('es6-promise').polyfill();
require('isomorphic-fetch');

const IsbnUtil = require('isbn-utils');

class Google {
  getUrlForIsbn(p) {
    return `https://www.googleapis.com/books/v1/volumes?q=isbn:${p.isbn}`;
  }

  searchIsbn(isbn) {
    const params = {
      isbn: isbn,
    };
    const url = this.getUrlForIsbn(params);
    // console.log('searchIsbn url', url);
    return this.fetch(url);
  }

  fetch(url) {
    console.debug('fetch url', url);
    return fetch(url)
      .then(response => {
        // console.log('response', response);
        return response.json();
      })
      .then(response => {
        console.log('response.json', response);
      });
  }
}

export default Google;
