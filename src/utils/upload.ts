/* eslint-disable prefer-promise-reject-errors */
// 判断图片还是文件
// 图片转存

import { showToast } from './common';
import { getOssSignatureApi } from '@/api/infra';

// 生成文件名，作为 key 使用
const generateFileName = (ossData, filePath) => {
  const suffix = filePath.slice(filePath.lastIndexOf('.'));
  const filename = Date.now() + suffix;
  return filename;
};

export const getFileNameFromUrl = (url) => {
  let filename;
  if (url.indexOf('/') > 0) {
    if (url.indexOf('?') > 0) {
      url = url.split('?')[0];
    }
    // 如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
    filename = url.substring(url.lastIndexOf('/') + 1, url.length);
  }
  return filename;
};

// 判断上传对象是图片还是文件
export function isUploadType(fileName) {
  let fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
  if (fileExtension) {
    fileExtension = fileExtension.toLowerCase();
  }
  const isJpgOrPng =
    fileExtension === 'jpeg' ||
    fileExtension === 'png' ||
    // file.type === 'image/svg' ||
    fileExtension === 'jpg';
  // file.type === 'image/gif' ||
  // file.type === 'video/ogg' ||
  // file.type === 'video/flv' ||
  // file.type === 'video/avi' ||
  // file.type === 'video/wmv' ||
  // file.type === 'video/mov' ||
  // file.type === 'video/mp4';
  if (isJpgOrPng) {
    return true;
  } else {
    return false;
  }
}

/**
 * cos上传
 * @param file 文件对象
 * @returns {Promise<void>}
 */
export const ossUploadFile = (
  fileSrc,
  isAbsoluteUrl = true,
  relativeDir = ''
) => {
  uni.showLoading();
  return new Promise((resolve, reject) => {
    getOssSignatureApi()
      .then(async (resp: any) => {
        const respData = resp.data;
        const key = generateFileName(respData, fileSrc);
        uni.uploadFile({
          url: respData.host,
          filePath: fileSrc,
          name: 'file',
          formData: {
            key:
              relativeDir === ''
                ? `${respData.dir}/${key}`
                : `${respData.dir}/${relativeDir}/${key}`,
            OSSAccessKeyId: respData.accessid,
            policy: respData.policy,
            signature: respData.signature,
            success_action_status: 200
          },
          success: (res) => {
            if (res.statusCode === 200) {
              if (isAbsoluteUrl) {
                resolve(
                  relativeDir === ''
                    ? `${respData.host}/${respData.dir}/${key}`
                    : `${respData.host}/${respData.dir}/${relativeDir}/${key}`
                );
              } else {
                resolve(
                  relativeDir === ''
                    ? `/${respData.dir}/${key}`
                    : `/${respData.dir}/${relativeDir}/${key}`
                );
              }
            } else {
              reject();
            }
            uni.hideLoading();
          },
          fail: (err) => {
            console.log('failErr:', err);
            uni.hideLoading();
            showToast(err.errMsg);
          }
        });
      })
      .catch((err) => {
        console.log('getOssSignatureApiErr:', err);
        uni.hideLoading();
        reject();
      });
  });
};
