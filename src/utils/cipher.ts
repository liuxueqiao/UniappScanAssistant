import CryptoJS from 'crypto-js';
import { decrypt, encrypt } from 'crypto-js/aes';
import UTF8, { parse } from 'crypto-js/enc-utf8';
import pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import md5 from 'crypto-js/md5';
import Base64 from 'crypto-js/enc-base64';

export interface EncryptionParams {
  key: string;
  iv: string;
}

export class AesEncryption {
  private key;
  private iv;

  constructor(opt: Partial<EncryptionParams> = {}) {
    const { key, iv } = opt;
    if (key) {
      this.key = parse(key);
    }
    if (iv) {
      this.iv = parse(iv);
    }
  }

  get getOptions() {
    return {
      mode: ECB,
      padding: pkcs7,
      iv: this.iv
    };
  }

  encryptByAES(cipherText: string) {
    return encrypt(cipherText, this.key, this.getOptions).toString();
  }

  decryptByAES(cipherText: string) {
    return decrypt(cipherText, this.key, this.getOptions).toString(UTF8);
  }
}

export function encryptByBase64(cipherText: string) {
  return UTF8.parse(cipherText).toString(Base64);
}

export function decodeByBase64(cipherText: string) {
  return Base64.parse(cipherText).toString(UTF8);
}

export function encryptByMd5(password: string) {
  return md5(password).toString();
}

/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function aesEncrypt(word, keyWord = 'XwKsGlMcdPMEhR1B') {
  const key = CryptoJS.enc.Utf8.parse(keyWord);
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

/**
 *加密处理
 */
export function encryption(params: any) {
  const { data, type, param } = params;
  let { key } = params;
  const result = JSON.parse(JSON.stringify(data));
  if (type === 'Base64') {
    param &&
      param.forEach((ele: any) => {
        result[ele] = btoa(result[ele]);
      });
  } else {
    param &&
      param.forEach((ele: any) => {
        const data = result[ele];
        key = CryptoJS.enc.Latin1.parse(key);
        const iv = key;
        // 加密
        const encrypted = CryptoJS.AES.encrypt(data, key, {
          iv,
          mode: CryptoJS.mode.CFB,
          padding: CryptoJS.pad.NoPadding
        });
        result[ele] = encrypted.toString();
      });
  }
  return result;
}
