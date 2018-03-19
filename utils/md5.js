/**
 * Author:ll36
 * Create Time:2018/03/15 10:55
 * Descripttion:检查MD5加密(数组或字符串，字符串)，MD5加密(数组或字符串)
 */
const crypto = require('crypto');

const SEP = '|',
  FLAG = 'yunli',
  KEY = [1, 1, 0, 0, 3, 6, 1, 1],
  IV = [1, 1, 0, 0, 3, 6, 1, 1];

const encryptMd = function (arr) {
  if (!arr || !arr.length) {
    return '';
  }
  if (!Array.isArray(arr) || arr.length === 1) {
    arr = Array.isArray(arr) ? arr[0] : arr;
  } else {
    arr = arr.join(SEP);
  }
  return crypto.createHash('md5').update(arr + SEP + FLAG, 'utf-8').digest('hex');
};

const encryptDes = function (str) {
  if (!str) {
    return '';
  }
  str = str.toString();
  let cipher = crypto.createCipheriv('des', new Buffer(KEY), new Buffer(IV));
  let crypted = cipher.update(str, 'utf8', 'binary');

  crypted += cipher.final('binary');
  crypted = new Buffer(crypted, 'binary').toString('base64');
  return crypted;
};

const decipherDes = function (crypted) {
  if (!crypted) {
    return '';
  }
  crypted = crypted.toString();
  crypted = new Buffer(crypted, 'base64').toString('binary');
  let decipher = crypto.createDecipheriv('des', new Buffer(KEY), new Buffer(IV));
  let decoded = decipher.update(crypted, 'binary', 'utf8');

  decoded += decipher.final('utf8');
  return decoded;
};

const checkMd = function (arr, md) {
  return encryptMd(arr) === md;
};


module.exports = {encryptMd, checkMd, encryptDes, decipherDes};