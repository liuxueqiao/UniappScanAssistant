import dayjs from 'dayjs';

/**
 * @returns 今日
 */
function formatDate(date) {
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? `0${m}` : m;
  let d = date.getDate();
  d = d < 10 ? `0${d}` : d;
  return `${y}-${m}-${d}`;
}
export function getToday() {
  return [formatDate(new Date()), formatDate(new Date())];
}
/**
 * @returns 昨日
 */
export function getYesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return [formatDate(date), formatDate(date)];
}
/**
 * @returns 本周
 */
export function getThisWeek() {
  const currentDate = dayjs();

  // 周日特殊处理
  if (currentDate.day() === 0) {
    return [
      currentDate.subtract(6, 'day').format('YYYY-MM-DD'),
      currentDate.format('YYYY-MM-DD')
    ];
  } else {
    return [
      currentDate.startOf('week').add(1, 'day').format('YYYY-MM-DD'),
      currentDate.endOf('week').add(1, 'day').format('YYYY-MM-DD')
    ];
  }
}
/**
 * @returns 上周
 */
export function getLastWeek() {
  const currentDate = dayjs();

  // 周日特殊处理
  if (currentDate.day() === 0) {
    return [
      currentDate.subtract(13, 'day').format('YYYY-MM-DD'),
      currentDate.subtract(7, 'day').format('YYYY-MM-DD')
    ];
  } else {
    return [
      currentDate.startOf('week').subtract(6, 'day').format('YYYY-MM-DD'),
      currentDate.endOf('week').subtract(6, 'day').format('YYYY-MM-DD')
    ];
  }
}

/**
 * @returns 上上周
 */
export function getLastTwoWeek() {
  const currentDate = dayjs();

  // 周日特殊处理
  if (currentDate.day() === 0) {
    return [
      currentDate.subtract(20, 'day').format('YYYY-MM-DD'),
      currentDate.subtract(14, 'day').format('YYYY-MM-DD')
    ];
  } else {
    return [
      currentDate.startOf('week').subtract(13, 'day').format('YYYY-MM-DD'),
      currentDate.endOf('week').subtract(13, 'day').format('YYYY-MM-DD')
    ];
  }
}

/**
 * @returns 去年的本周
 */
export function getLastYearWeek() {
  const currentDate = dayjs();

  // 周日特殊处理
  if (currentDate.day() === 0) {
    return [
      currentDate.subtract(6, 'day').subtract(1, 'year').format('YYYY-MM-DD'),
      currentDate.subtract(1, 'year').format('YYYY-MM-DD')
    ];
  } else {
    return [
      currentDate
        .startOf('week')
        .add(1, 'day')
        .subtract(1, 'year')
        .format('YYYY-MM-DD'),
      currentDate
        .endOf('week')
        .add(1, 'day')
        .subtract(1, 'year')
        .format('YYYY-MM-DD')
    ];
  }
}

/**
 * @returns 去年的上周
 */
export function getLastYearLastWeek() {
  const currentDate = dayjs();

  // 周日特殊处理
  if (currentDate.day() === 0) {
    return [
      currentDate.subtract(13, 'day').subtract(1, 'year').format('YYYY-MM-DD'),
      currentDate.subtract(7, 'day').subtract(1, 'year').format('YYYY-MM-DD')
    ];
  } else {
    return [
      currentDate
        .startOf('week')
        .subtract(6, 'day')
        .subtract(1, 'year')
        .format('YYYY-MM-DD'),
      currentDate
        .endOf('week')
        .subtract(6, 'day')
        .subtract(1, 'year')
        .format('YYYY-MM-DD')
    ];
  }
}

/**
 * @returns 本月
 */
export function getThisMonth() {
  const date = new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  return [formatDate(firstDayOfMonth), formatDate(new Date())];
}
/**
 * @returns 上月
 */
export function getLastMonth() {
  const now = new Date(); // 获取当前日期和时间
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // 获取上个月的开始日期
  const lastDayOfPreviousMonth = new Date(
    previousMonth.getFullYear(),
    previousMonth.getMonth() + 1,
    0
  ); // 获取上个月的最后一天
  return [formatDate(previousMonth), formatDate(lastDayOfPreviousMonth)];
}
/**
 * @returns 本年
 */
export function getThisYear() {
  // 获取本年第一天的日期
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  return [formatDate(startOfYear), formatDate(new Date())];
}

export const get15Days = () => {
  const today = new Date();
  const fifteenDaysAgo = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000);
  return [formatDate(fifteenDaysAgo), formatDate(today)];
};
export const get365days = () => {
  const today = new Date();
  const yearDaysAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
  return [formatDate(yearDaysAgo), formatDate(today)];
};

/**
 * @param recentDays number 最近几天
 * @returns 最近几天日期字符串
 */
export const getRecentDaysHMS = (recentDays) => {
  const today = new Date();
  const hours = `0${today.getHours()}`.slice(-2);
  const minutes = `0${today.getMinutes()}`.slice(-2);
  const seconds = `0${today.getSeconds()}`.slice(-2);
  const daysAgo = new Date(today.getTime() - recentDays * 24 * 60 * 60 * 1000);
  const hmsStr = `${hours}:${minutes}:${seconds}`;
  return [`${formatDate(daysAgo)} ${hmsStr}`, `${formatDate(today)} ${hmsStr}`];
};

/**
 * @param recentDays number 最近几天
 * @returns 最近几天日期字符串
 */
export const getRecentDays = (recentDays) => {
  const today = new Date();
  const daysAgo = new Date(today.getTime() - recentDays * 24 * 60 * 60 * 1000);
  return [`${formatDate(daysAgo)}`, `${formatDate(today)}`];
};
