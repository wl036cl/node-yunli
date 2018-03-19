/**
 * Author:ll36
 * Create Time:2018/03/14 15:56
 * Descripttion:
 */

exports.extend = function () {
  let options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {}, // 目标对象
    i = 1,
    length = arguments.length,
    deep = false;

  // 处理深度拷贝情况（第一个参数是boolean类型且为true）
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    // 跳过第一个参数（是否深度拷贝）和第二个参数（目标对象）
    i = 2;
  }
  // 如果目标不是对象或函数，则初始化为空对象
  if (typeof target !== 'object' && !jQuery.isFunction(target)) {
    target = {};
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) !== null) {
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];
        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }
        // 如果对象中包含了数组或者其他对象，则使用递归进行拷贝
        if (deep && copy && ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')) {
          // 处理数组
          if (copyIsArray) {
            copyIsArray = false;
            // 如果目标对象不存在该数组，则创建一个空数组；
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && typeof src === 'object' ? src : {};
          }
          // 从不改变原始对象，只做拷贝
          target[name] = extend(deep, clone, copy);
          // 不拷贝undefined值
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  // 返回已经被修改的对象
  return target;
};
exports.getClientIp = function (req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};
exports.getRandStringEx = function (length) {
  length = Number(length) || 0;
  length = length > 64 ? 64 : length;
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let [result, i, charLength] = ['', 0, chars.length];

  for (; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
};