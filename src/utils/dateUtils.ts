import dayjs from 'dayjs';

/**
 * 格式化日期
 *
 * @param date Date对象/'2025-01-01'/时间戳/不传默认今天
 * @param fmt 'YYYY-MM-DD HH:mm:ss'
 * @returns
 */
export function dateFormat(date, fmt = 'YYYY-MM-DD') {
  let d = date;
  if (!d) {
    d = new Date();
  }
  return dayjs(d).format(fmt);
}

/**
 * 修改日期格式，把月和日补0
 *
 * @param dateStr yyyy-M-d格式日期字符串
 * @param fmt 格式化
 */
export function dateFormatMD(dateStr, fmt = 'YYYY-MM-DD') {
  if (!dateStr) {
    return '';
  }
  // 使用 dayjs 解析原始日期字符串
  const parsedDate = dayjs(dateStr, 'YYYY-M-D');
  return parsedDate.format(fmt);
}

/**
 * 获取日期的今天，明天，后天等
 *
 * @param addDayCount -1是昨天，0是今天，1是后一天
 * @returns yyyy-MM-dd
 */
export function getDateStr(addDayCount = 0) {
  // 获取当前日期
  const today = dayjs();

  if (addDayCount < 0) {
    // 获取昨天的日期
    const yesterday = today.subtract(Math.abs(addDayCount), 'day');
    const formattedYesterday = yesterday.format('YYYY-MM-DD');
    return formattedYesterday;
  } else if (addDayCount > 0) {
    // 获取明天的日期
    const tomorrow = today.add(addDayCount, 'day');
    const formattedTomorrow = tomorrow.format('YYYY-MM-DD');
    return formattedTomorrow;
  } else {
    const formattedToday = today.format('YYYY-MM-DD');
    return formattedToday;
  }
}

/**
 * 修改日期格式，把月和日补0
 *
 * @param dateStr yyyy-M-d格式日期字符串
 * @param split 分隔符，默认-
 * @returns yyyy-MM-dd格式日期字符串
 */
export function changeDateFormatAddZero(dateStr, split = '-') {
  const temp = dateStr.split(split);

  const y = temp[0];
  let m = temp[1]; // 获取当前月份的日期
  let d = temp[2];

  if (Number(m) < 10) {
    m = `0${Number(m)}`;
  }
  if (Number(d) < 10) {
    d = `0${Number(d)}`;
  }
  return `${y}-${m}-${d}`;
}

/**
 * 计算2个日期之间的差值
 * @param startDate:开始日期
 * @param endDate:结束日期,结束日期要比开始日期大
 * @param dateType:日期类型,有如下类型:'minute','hour','day','week','month','year'这六种类型
 * @returns {number}
 */
export function getDateDiff(startDate, endDate, dateType) {
  return dayjs(endDate).diff(dayjs(startDate), dateType);
}

/**
 * 判断date1是否在date2之前,比如:date1:2023-01-01 13:30:23,date2:2022-12-01 13:30:23,结果为false
 * @param date1
 * @param date2
 * @returns {boolean}
 */
export function isBefore(date1, date2) {
  return dayjs(date1).isBefore(dayjs(date2));
}

/**
 * 计算年龄的方法
 * @returns
 */
export function calculateAge(birthday) {
  if (!birthday) {
    return;
  }

  const birthDate = dayjs(birthday);
  const currentYear = dayjs().year();
  const birthYear = birthDate.year();

  let age;
  if (birthDate.isValid()) {
    age = currentYear - birthYear;
  } else {
    // 无效的日期
    age = undefined;
  }
  return age;
}

/**
 * 是否过效期
 * @returns
 */
export function expireDateExpired(date) {
  if (!date) {
    return false;
  }

  const expiredDate = dayjs(date);
  const current = dayjs();

  if (expiredDate.isBefore(current)) {
    return true;
  }

  return false;
}
