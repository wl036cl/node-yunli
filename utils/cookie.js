/**
 * Author:ll36
 * Create Time:2018/03/16 11:43
 * Descripttion:
 */
const {encryptDes, decipherDes} = require('./md5');

//duration单位：second
const setCookie = function (res, name, val, duration, isEncrypt) {
    val = isEncrypt ? encryptDes(val) : val;

    res.cookie(name, val, {
        path: '/',//访问哪一个路径的时候我们给你加上cookie
        maxAge: duration * 1000//cookie的存活时间,单位毫秒
    });
    return true;
};

const getCookie = function (req, name, isEncrypt) {
    let result = req.cookies[name];

    //console.log('result:'+result);
    if (result && isEncrypt) {
        result = decipherDes(result);
    }

    return result;
};

const delCookie = function (res, name) {
    return res.clearCookie(name);
};

module.exports = {setCookie, getCookie, delCookie};