import TimeUtil from '../src/modules/timeUtil';

it('dateToTimestamp_ok', () => {
  const date = 'Wed, 06 May 2020 08:34:04 GMT';
  const expected = 1588754044000;
  const result = TimeUtil.dateToTimestamp(date);
  expect(result).toEqual(expected);
});
