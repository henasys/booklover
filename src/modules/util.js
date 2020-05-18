export function splitCategoryName(categoryName) {
  return categoryName ? categoryName.split('>') : [];
}

export function parseInteger(value) {
  // console.log('parseInteger', value, typeof value);
  return typeof value === 'string' ? parseInt(value, 10) : value;
}

export function getExtension(fileName) {
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(fileName)[1];
  return ext;
}

export function getCountFromCountList(countList, categoryId) {
  const countItem = countList.find(item => item.categoryId === categoryId);
  return countItem ? countItem.count : 0;
}

export default {
  splitCategoryName,
  parseInteger,
  getExtension,
  getCountFromCountList,
};
