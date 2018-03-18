/**
 * Author:ll36
 * Create Time:2018/03/14 18:43
 * Descripttion:userToken模块
 */
const executeSql = require('./db'),
    log = require('../utils/log'),
    {extend} = require('../utils/utils');

const table = 'userToken';

class UserToken {
    constructor() {
        this.id = 0;
        this.userId = 0;
        this.token = '';//token
        this.ip = '';//登录IP
        this.createTime = '';//创建/退出时间
        this.overTime = '';//过期时间
        this.status = '';//状态0：可用；1：不可用（过期）
    }

    add() {
        return new Promise((resolve,reject)=>{
            if(!this.userId)
            {
                log.error('USERTOKEN=>add：ERROR USERID(' + this.userId + ')');
                reject('ERROR USERID');
            }else {
                let sql = "insert into `" + table + "` (userId,token,ip,createTime,overTime,`status`)" +
                    " values (" +
                    "'" + this.userId + "'," +
                    "'" + this.token + "'," +
                    "'" + this.ip + "'," +
                    "'" + this.createTime + "'," +
                    "'" + this.overTime + "'," +
                    "'" + this.status + "');";

                executeSql(sql).then(rows=>{
                    let data = JSON.parse(rows);

                    if (data && data.affectedRows) {
                        this.id=data.insertId;//自增ID
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }).catch(err=>{
                    reject(JSON.stringify(err));
                });
            }
        });
    }
    updateOverTime(){
        return new Promise((resolve, reject) => {
            if(!this.id||!this.userId){
                log.error('USERTOKEN=>updateOverTime：ERROR DATA('+this.id+',' + this.userId + ')');
                reject('ERROR DATA');
            }else{
                let sql = "update `" + table + "` set " +
                    "overTime='" + this.overTime + "'" +
                    " where userid='"+this.id+"'";

                executeSql(sql).then(rows=>{
                    let data = JSON.parse(rows);

                    if (data && data.affectedRows) {
                        this.userId=data.insertId;//自增ID

                        //extend(this, data[0]);
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }).catch(err=>{
                    reject(JSON.stringify(err));
                });
            }
        });
    }
    getModel(userId, token) {
        return new Promise((resolve, reject) => {
            if (!Number(userId) || !token || !token.length) {
                log.error('USERTOKEN=>getModel：ERROR QUERY(' + userId + ',' + token + ')');
                reject('ERROR PHONE');
            } else {
                let sql = "select * from `" + table + "` where userid='" + userId + "' and token='" + token + "' order by overTime desc";

                executeSql(sql).then(rows=>{
                    let data = JSON.parse(rows);

                    if (data && data.length) {
                        extend(this, data[0]);
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }).catch(err=>{
                    reject(err);
                });
            }
        });
    }
}
module.exports = UserToken;