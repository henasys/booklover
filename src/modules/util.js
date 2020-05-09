export function splitCategoryName(categoryName) {
  return categoryName ? categoryName.split('>') : [];
}

export function parseInteger(value) {
  console.log('parseInteger', value, typeof value);
  return typeof value === 'string' ? parseInt(value, 10) : value;
}

export default {
  splitCategoryName,
  parseInteger,
};
