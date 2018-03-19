/**
 * Author:ll36
 * Create Time:2018/03/14 18:32
 * Descripttion:user控制器
 */
const User = require('../models/user');
const UserToken = require('../models/userToken');
const {dataSuccess, dataError} = require('./defaultReturn');
const {encryptDes, decipherDes, checkMd} = require('../utils/md5');
const {getRandStringEx, getClientIp} = require('../utils/utils');
const {userLoginType, userTokenStatus} = require('../models/enums');
const {setCookie} = require('../utils/cookie');
const moment = require('moment');
const log = require('../utils/log');

const overTimeDay = 15;//token过期天数

exports.loginIn = async function (req, res, type, oauthUId, oauthToken) {
  try {
    if (!req||!res||!oauthUId || !oauthToken || !type) {
      return dataError;
    }

    let [user, userToken, now, ip, isLogin, result] = [new User(), new UserToken(), moment(), getClientIp(req), false, false];

    if (Number(type) === userLoginType.byPsw) {
      //帐号(oauthUId)+密码(oauthToken)
      result = await user.getModelByUserId(oauthUId);//先检查是否UserId
      if (!result && oauthUId.length === 11) {//不是UserIdj检查是否手机号
        result = await user.getModelByPhone(oauthUId);
      }
      if (result && checkMd(oauthToken, user.passWord)) {
        //插入新的userToken
        userToken.userId = user.userId;
        userToken.token = getRandStringEx(8);
        userToken.createTime = now.format('YYYY/MM/DD HH:mm:ss');
        userToken.ip = ip;
        userToken.status = userTokenStatus.enabled;
        userToken.overTime = now.add(overTimeDay, 'days').format('YYYY/MM/DD HH:mm:ss');
        //插入token
        isLogin = await userToken.add();
        if (!isLogin) {
          dataError.msg = '登录失败！';
          return dataError;
        }
      } else {
        dataError.msg = '帐号或密码错误！';
        return dataError;
      }
    }
    else if (Number(type) === userLoginType.byToken) {
      //token登录
      oauthUId = decipherDes(oauthUId);
      oauthToken = decipherDes(oauthToken);

      result = await userToken.getModel(oauthUId, oauthToken);
      if (result) {
        if (Number(userToken.status) !== userTokenStatus.enabled) {
          dataError.msg = '该帐号已退出，请重新登录！';
          return dataError;
        }
        if (moment(userToken.overTime) <= moment()) {
          dataError.msg = '你上次登录距离现在太久，请重新登录！';
          return dataError;
        }
        isLogin = true;
        user.userId = oauthUId;
        //更新该userToken
        userToken.overTime = now.add(overTimeDay, 'days').format('YYYY/MM/DD HH:mm:ss');
        userToken.updateOverTime();
      } else {
        //token不存在，防止刷token，抛出异常
        const cookieKey = 'yunli_token_count';

        let count = Number(getCookie(req, cookieKey, true)) || 0;

        if (count > 5) {//1分钟内错5次抛错误
          throw new Error('登录信息错误！');
        } else {

          setCookie(res, '', count + 1, 1 * 60, true);
          dataError.msg = '登录信息错误！';
          return dataError;
        }
      }
    }

    if (isLogin) {
      //更新登录记录
      user.score += 1;
      user.lastLoginTime = now.format('YYYY/MM/DD HH:mm:ss');
      user.lastLoginIp = ip;
      user.updateLogin();

      //console.log('4444');
      //userId，userToken加密
      let [encryptUserId, encryptToken] = [encryptDes(userToken.userId), encryptDes(userToken.token)];

      dataSuccess.msg = '登录成功！';
      dataSuccess.data = {uid: encryptUserId, token: encryptToken};

      //setCookie（有效期15天）
      setCookie(res, 'yunli_uid', encryptUserId, 15 * 24 * 60 * 60, false);
      setCookie(res, 'yunli_token', encryptToken, 15 * 24 * 60 * 60, false);
      return dataSuccess;
    }
  }
  catch(err)
  {
    dataError.msg = err;
    //错误写入日志
    log.write('IP：' + getClientIp(req) + '=>Time：' + moment().format('YYYY/MM/DD HH:mm:ss') + '=>Query：(' + type + ',' + oauthUId + ',' + oauthToken + ')\r\nUa：' + req.headers['user-agent'] + '\r\nMSG：' + JSON.stringify(err));
    return dataError;
  }
}
