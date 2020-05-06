import moment from 'moment';
import 'moment/locale/ko';

export function msToTime(s) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
  // return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}

export function timeToDate(timestamp) {
  return moment(timestamp).format('Y/MM/DD');
}

export function timeToYear(timestamp) {
  return moment(timestamp).format('Y');
}

export function timeToYearMonth(timestamp) {
  return moment(timestamp).format('Y/MM');
}

export function timeToWeek(timestamp) {
  return moment(timestamp).format('dddd');
}

export function timeToHourMin(timestamp) {
  return moment(timestamp).format('HH:mm');
}

export function timeToDateHourMin(timestamp) {
  return moment(timestamp).format('Y/MM/DD HH:mm');
}

export function timeToMonthDay(timestamp) {
  return moment(timestamp).format('MM/DD');
}

export function timeToMonthDayWeek(timestamp) {
  return moment(timestamp).format('MM/DD (ddd)'); // 04/07 (화)
}

export function yearToTimestamp(year) {
  const timestamp = moment(String(year), 'YYYY').format('x');
  return parseInt(timestamp, 10);
}

/**
 * year month to timestamp
 * @param {*} year 4 digit year
 * @param {*} month 1 ~ 12, if exceed, then year + 1, m = 1
 */
export function yearMonthToTimestamp(year, month) {
  const params = month > 12 ? {y: year + 1, m: 1} : {y: year, m: month};
  const m = moment(`${params.y}/${params.m}`, 'YYYY/MM');
  const timestamp = m.format('x');
  return parseInt(timestamp, 10);
}

/**
 * timestamp to {year, month}
 * @param {*} timestamp could be undefined, return now date
 */
export function timeToYearAndMonthValue(timestamp) {
  const t = timestamp === undefined ? moment() : moment(timestamp);
  return {year: t.year(), month: t.month() + 1};
}

export function dateToTimestamp(date) {
  const m = moment(date);
  const timestamp = m.format('x');
  return parseInt(timestamp, 10);
}

export default {
  msToTime,
  timeToDate,
  timeToYear,
  timeToYearMonth,
  timeToWeek,
  timeToHourMin,
  timeToDateHourMin,
  timeToMonthDay,
  timeToMonthDayWeek,
  yearToTimestamp,
  yearMonthToTimestamp,
  timeToYearAndMonthValue,
  dateToTimestamp,
};
