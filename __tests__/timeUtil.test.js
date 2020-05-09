import TimeUtil from '../src/modules/timeUtil';

it('dateToTimestamp_ok', () => {
  const date = 'Wed, 06 May 2020 08:34:04 GMT';
  const expected = 1588754044000;
  const result = TimeUtil.dateToTimestamp(date);
  expect(result).toEqual(expected);
});

it('dateToTimestamp_ok_1', () => {
  const date = '2020-04-04';
  const expected = 1585926000000;
  const result = TimeUtil.dateToTimestamp(date);
  expect(result).toEqual(expected);
});

it('dateToTimestamp_undefined', () => {
  const date = undefined;
  const expected = null;
  const result = TimeUtil.dateToTimestamp(date);
  expect(result).toEqual(expected);
});

it('dateToTimestamp_null', () => {
  const date = null;
  const expected = null;
  const result = TimeUtil.dateToTimestamp(date);
  expect(result).toEqual(expected);
});
