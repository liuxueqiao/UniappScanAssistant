import { showToast } from '@/utils/common';
/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export const validateEmail = (str: string) => {
  const regexp =
    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(str);
};
/**
 * 手机号校验（和服务端统一正则表达式）
 * @param mobile
 * @returns {boolean}
 */
export const isValidatePhone = (phoneNumber: string) => {
  // 定义手机号正则表达式
  const phoneRegex = /^(?:0|86|\+86)?1[3-9]\d{9}$/;
  return phoneRegex.test(phoneNumber);
};

export const isValidLandlineNumber = (landlineNumber: string) => {
  // 定义座机号正则表达式
  const landlineRegex = /^\d{4,20}$/;
  return landlineRegex.test(landlineNumber);
};

/**
 * 校验追溯码格式为20位纯数字
 */
export const isValidTraceCodeNumber = (traceCode: string) => {
  // 定义座机号正则表达式
  const landlineRegex = /^\d{20}$/;
  return landlineRegex.test(traceCode);
};

export const validateMobileDigit = (mobile: string) => {
  if (!mobile) {
    return false;
  }
  if (mobile.length < 11) {
    return false;
  }
  return true;
};

export const validateMobileLegal = (mobile: string) => {
  if (!isValidatePhone(mobile)) {
    showToast('请输入正确的手机号码');
    return false;
  }
  return true;
};
export const validatePassword = (pwd: string) => {
  const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z]{8,20}$/;
  if (!PASSWORD_REGEX.test(pwd)) {
    return false;
  }
  return true;
};

export const validateAgreement = (flag: boolean) => {
  if (!flag) {
    showToast('请勾选服务协议及隐私声明');
    return false;
  }
  return true;
};

export const isRightIdCardLength = (card: cardType): boolean => {
  // 身份证位数校验，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  const reg = /^\d{17}(\d|X|x)$/;
  return reg.test(card);
};

export const checkProvince = (
  card: cardType,
  cityCodeArr: string[]
): boolean => {
  const province = card.slice(0, 2);
  return cityCodeArr.includes(province);
};

export const checkBirthday = (card: cardType): boolean => {
  // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
  if (!card || card.length !== 18) {
    return false;
  }
  const reg = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/;
  const arrData = card.match(reg);
  if (arrData) {
    const year = arrData[2];
    const month = arrData[3];
    const day = arrData[4];
    const birthday = new Date(`${year}/${month}/${day}`);
    return verifyBirthday(year, month, day, birthday);
  } else {
    return false;
  }
};

// 检测校验位
export const checkParity = (card: cardType): boolean => {
  // 第一代居民身份证(15位)已经于2013年1月1日正式退出
  // 故不做15位转18位换算
  if (card.length < 18) {
    return false;
  }
  const arrInt: number[] = [
    7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2
  ];
  const arrCh: string[] = [
    '1',
    '0',
    'X',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2'
  ];
  let cardTemp = 0;
  for (let i = 0; i < 17; i++) {
    cardTemp += Number(card.slice(i, i + 1)) * arrInt[i];
  }
  const checkBit = arrCh[cardTemp % 11];
  if (checkBit === card.slice(17).toLocaleUpperCase()) {
    return true;
  }
  return false;
};

export const validIdCard = (idCard: cardType): boolean => {
  // 例如 "11":"北京"
  const cityCodeArr: string[] = [
    '11',
    '12',
    '13',
    '14',
    '15',
    '21',
    '22',
    '23',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '50',
    '51',
    '52',
    '53',
    '54',
    '61',
    '62',
    '63',
    '64',
    '65',
    '71',
    '81',
    '82',
    '91'
  ];
  // 是否为空
  if (!idCard) {
    return false;
  }
  // 校验长度，类型
  if (isRightIdCardLength(idCard) === false) {
    return false;
  }
  // 检查省份
  if (checkProvince(idCard, cityCodeArr) === false) {
    return false;
  }
  // 校验生日
  if (checkBirthday(idCard) === false) {
    return false;
  }
  // 检验位的检测
  if (checkParity(idCard) === false) {
    return false;
  }
  return true;
};

type cardAnalysisType = 'birthDate' | 'sex' | 'age';
//  避免精度丢失 例如 210321198708251611 --> 210321198708251620, 故身份证号类型需为String类型
type cardType = string;
/**
 * @description 解析身份证信息
 * @param {String} idCard - 身份证号
 * @param {Number} analysisType - 解析类型（birthDate-出生日期 sex-性别 age-年龄）
 * @return {String}
 */
export const getAnalysisIdCard = (
  idCard: cardType,
  analysisType: cardAnalysisType = 'birthDate'
): string | number => {
  const analysisTypeArr: string[] = ['birthDate', 'sex', 'age'];
  if (!idCard) {
    throw new Error('传入身份证不能为空！');
  }
  if (!analysisTypeArr.includes(analysisType)) {
    throw new Error('请传入正确的解析类型！');
  }
  if (!validIdCard(idCard)) {
    throw new Error('传入身份证格式有误!');
  }
  const analysisObj = {
    birthDate: (idCard: cardType) => {
      // 获取出生日期
      const birth = `${idCard.substring(6, 10)}-${idCard.substring(
        10,
        12
      )}-${idCard.substring(12, 14)}`;
      return birth;
    },
    sex: (idCard: cardType) => {
      // 获取性别
      const sex = parseInt(idCard[16]) % 2 === 1 ? '男' : '女';
      return sex;
    },
    age: (idCard: cardType) => {
      // 获取年龄(计算周岁，未过今年的生日则不加上一岁)
      const myDate = new Date();
      const month = myDate.getMonth() + 1;
      const day = myDate.getDate();
      let age = myDate.getFullYear() - Number(idCard.substring(6, 10)) - 1;
      if (
        Number(idCard.substring(10, 12)) < month ||
        (Number(idCard.substring(10, 12)) === month &&
          Number(idCard.substring(12, 14)) <= day)
      ) {
        age++;
      }
      return age;
    }
  };
  return analysisObj[analysisType](idCard);
};

// 校验日期
function verifyBirthday(
  year: string,
  month: string,
  day: string,
  birthday: any
): boolean {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // 年月日是否合理
  if (
    birthday.getFullYear() === Number(year) &&
    birthday.getMonth() + 1 === Number(month) &&
    birthday.getDate() === Number(day)
  ) {
    // 判断年份的范围（0岁到100岁之间)
    const time = currentYear - Number(year);
    if (time >= 0 && time <= 100) {
      return true;
    }
    return false;
  }
  return false;
}
