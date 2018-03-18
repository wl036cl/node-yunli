/**
 * Author:ll36
 * Create Time:2018/03/13 18:37
 * Descripttion:连接数据库，执行sql
 */
//1.引入配置文件
const config = require('../config/mysql.config'),
    mysql = require('mysql'),
    log = require('../utils/log');

function executeSql(sql) {
    return new Promise(function (resolve, reject) {
        const connection = mysql.createConnection(config);

        connection.connect(err => {
            if (err) {
                log.error('建立连接失败：' + JSON.stringify(err));
                reject('建立连接失败：' + JSON.stringify(err));
            }
        });
        connection.query(sql, (err, rows) => {
            if (err) {
                log.error('执行SQL失败(' + sql + ')：' + JSON.stringify(err));
                reject('执行SQL失败：' + JSON.stringify(err));
            } else {
                log.success('执行SQL成功！' + sql + '=>result：' + JSON.stringify(rows));
                resolve(JSON.stringify(rows));//转成string类型，解决错误，ERROR： First argument must be a string or Buffer
            }
        });
        connection.end(function (err) {
            if (err) {
                log.error('关闭连接失败：' + JSON.stringify(err));
                reject('关闭连接失败：' + JSON.stringify(err));
            }
        });
    });
}

// function executeSql(sql,callback) {
//     if (sql) {
//         //2.建立连接
//         const connection = mysql.createConnection(config);
//
//         connection.connect();
//         //3.执行sql
//         connection.query(sql, function (err, rows) {
//             if(err) {
//                 callback('101', 'DB ERROR=>Sql:' + sql + err.message);
//             }else
//             {
//                 const data=JSON.stringify(rows);
//
//                 callback('200',data);
//             }
//         });
//
//         //4.关闭连接
//         connection.end();
//     }
// }

module.exports = executeSql;