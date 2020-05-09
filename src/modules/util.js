export function splitCategoryName(categoryName) {
  return categoryName ? categoryName.split('>') : [];
}

export function parseInt(value) {
  console.log('parseInt', value, typeof value);
  return typeof value === 'string' ? parseInt(value, 10) : value;
}

export default {
  splitCategoryName,
  parseInt,
};
