/**
 * Author:ll36
 * Create Time:2018/03/13 18:37
 * Descripttion:user模块
 */
const executeSql = require('./db'),
  log = require('../utils/log'),
  {extend} = require('../utils/utils');

const table = 'user';

class User {
  constructor() {
    this.userId = 0;//userId
    this.phone = '';//帐号（手机号）
    this.passWord = '';//密码
    this.nickName = '';// 昵称
    this.email = '';//email
    this.headImg = '';// 头像地址（json:big,small）
    this.gender = -0;// 0：未知；1：男；2：女
    this.birthday = '';// 生日
    this.province = '';// 省份
    this.city = '';// 城市
    this.address = '';// 地址（全部）
    this.createTime = '';//注册时间
    this.lastLoginTime = '';// 最后一次登录时间
    this.lastLoginIp = '';// 最后登陆的IP
    this.score = '';// 积分
    this.sportsNum = '';// 项目数量
    this.figureNum = '';// 指数数量
    this.status = -1;//状态;0：未激活；1：激活；2：黑名单
  }

  add() {
    return new Promise((resolve, reject) => {
      if (!this.phone || !this.passWord) {
        log.error('USER=>add：ERROR PHONE(' + this.phone + ')');
        reject('ERROR PHONE');
      } else {
        let sql = 'insert into `' + table + '` (phone,passWord,nickName,email,headImg,gender,birthday,province,city,address,createTime,lastLoginTime,lastLoginIp,score,status,sportsNum,figureNum)' +
          ' values (' +
          '\'' + this.phone + '\',' +
          '\'' + this.passWord + '\',' +
          '\'' + this.nickName + '\',' +
          '\'' + this.email + '\',' +
          '\'' + this.headImg + '\',' +
          '\'' + this.gender + '\',' +
          '\'' + this.birthday + '\',' +
          '\'' + this.province + '\',' +
          '\'' + this.city + '\',' +
          '\'' + this.address + '\',' +
          '\'' + this.createTime + '\',' +
          '\'' + this.lastLoginTime + '\',' +
          '\'' + this.lastLoginIp + '\',' +
          '\'' + this.score + '\',' +
          '\'' + this.status + '\',' +
          '\'' + this.sportsNum + '\',' +
          '\'' + this.figureNum + '\')';

        executeSql(sql).then(rows => {
          let data = JSON.parse(rows);

          if (data && data.insertId) {
            this.userId = data.insertId;//自增ID
            log.success(JSON.stringify(data));
            resolve(true);
          }
          else {
            resolve(false);
          }
        }).catch(err => {
          reject(err);
        });
      }
    });
  }

  updateLogin() {
    return new Promise((resolve, reject) => {
      if (!this.userId) {
        log.error('USER=>updateLogin：ERROR DATA(' + this.userId + ')');
        reject('ERROR DATA');
      } else {
        let sql = 'update `' + table + '` set ' +
          'lastLoginTime=\'' + this.lastLoginTime + '\',' +
          'lastLoginIp=\'' + this.lastLoginIp + '\',' +
          'score=\'' + this.score + '\'' +
          ' where userid=\'' + this.userId + '\'';

        executeSql(sql).then(rows => {
          let data = JSON.parse(rows);

          if (data && data.insertId) {
            this.userId = data.insertId;//自增ID
            log.success(JSON.stringify(data));
            resolve(true);
          }
          else {
            resolve(false);
          }
        }).catch(err => {
          reject(JSON.stringify(err));
        });
      }
    });
  }

  existsPhone(phone) {
    return new Promise((resolve, reject) => {
      if (!phone) {
        log.error('USER=>existsPhone：ERROR PHONE(' + phone + ')');
        reject('ERROR PHONE');
      } else {
        let sql = 'select count(0) from `' + table + '` where phone=\'' + phone + '\'';

        executeSql(sql).then(rows => {
          let data = JSON.parse(rows);

          if (data && data.length && Number(data[0]) > 0) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        }).catch(err => {
          reject(JSON.stringify(err));
        });
      }
    });
  }

  getModelByUserId(userId) {
    return new Promise((resolve, reject) => {
      if (userId <= 0) {
        log.error('USER=>getModelByUserId：ERROR USERID(' + userId + ')');
        reject('ERROR USERID');
      } else {
        let sql = 'select * from `' + table + '` where userId=\'' + userId + '\'';

        executeSql(sql).then(rows => {
          let data = JSON.parse(rows);

          if (data && data.length) {
            extend(this, data[0]);
            resolve(true);
          }
          else {
            resolve(false);
          }
        }).catch(err => {
          reject(JSON.stringify(err));
        });
      }
    });
  }

  getModelByPhone(phone) {
    return new Promise((resolve, reject) => {
      if (!phone) {
        log.error('USER=>getModelByPhone：ERROR PHONE(' + phone + ')');
        reject('ERROR PHONE');
      } else {
        let sql = 'select * from `' + table + '` where phone=\'' + phone + '\'';

        executeSql(sql).then(rows => {
          let data = JSON.parse(rows);

          if (data && data.length) {
            extend(this, data[0]);
            resolve(true);
          }
          else {
            resolve(false);
          }
        }).catch(err => {
          reject(JSON.stringify(err));
        });
      }
    });
  }

  // getModelByPhone(phone,callback)//callback写法
  // {
  //     if(!phone) {
  //         callback('100','error phone');
  //     }
  //     let sql = "select * from `user` where phone=" + "'" + phone + "'";
  //
  //     executeSql(sql,
  //         function (code, data) {
  //             callback(code, data);
  //         });
  // }
}

module.exports = User;