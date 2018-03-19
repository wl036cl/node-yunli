/**
 * Author:ll36
 * Create Time:2018/03/14 18:20
 * Descripttion:
 */
const express = require('express'),
  cookieParser = require('cookie-parser'),
  routes = require('./routes/apiRoutes'),
  app = express();

//加载解析cookie的中间件
app.use(cookieParser());
//设置跨域访问// 设置请求头
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //*表示允许的域名地址，本地则为'http://localhost'
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

routes(app);

let server = app.listen(3000, function () {
  const host = server.address().address,
    port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
