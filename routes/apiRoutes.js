/**
 * Author:ll36
 * Create Time:2018/03/17 17:34
 * Descripttion:路由
 */
const {loginIn} = require('../controllers/user');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send('yunli');
    });
    // 登录接口
    app.get('/user/loginin', function (req, res) {
        // 打印post请求的数据内容
        const [oauthUId, oauthToken, type] = [req.query.oauthUId, req.query.oauthToken, Number(req.query.type)];

        loginIn(req, res, type, oauthUId, oauthToken).then(result => {
            res.end(JSON.stringify(result));
        }).catch(err => {
            res.end('调用失败！' + err);
        });
    });
};