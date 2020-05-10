import Util from '../src/modules/util';

it('splitCategoryName_1', () => {
  const input = 'level1>level2';
  const expected = ['level1', 'level2'];
  const result = Util.splitCategoryName(input);
  expect(result).toEqual(expected);
});

it('splitCategoryName_1_level', () => {
  const input = 'level1';
  const expected = ['level1'];
  const result = Util.splitCategoryName(input);
  expect(result).toEqual(expected);
});

it('splitCategoryName_empty', () => {
  const input = '';
  const expected = [];
  const result = Util.splitCategoryName(input);
  expect(result).toEqual(expected);
});
