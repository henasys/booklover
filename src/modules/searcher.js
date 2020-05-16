import Database from '../modules/database';
import Aladin from '../api/Aladin';
import Naver from '../api/Naver';

const getSearcher = realm => {
  const apiSource = Database.getSetting(realm).apiSource;
  let searcher;
  if (apiSource === Database.Setting.apiSourceType.ALADIN) {
    searcher = new Aladin();
  } else {
    searcher = new Naver();
    searcher.isNaver = true;
  }
  searcher.apiSource = apiSource;
  return searcher;
};

const postProcess = (searcher, book) => {
  if (searcher.isNaver) {
    return searcher.addTocAndCategoryName(book);
  } else {
    return new Promise((resolve, reject) => {
      resolve(book);
    });
  }
};

export default {
  getSearcher,
  postProcess,
};
