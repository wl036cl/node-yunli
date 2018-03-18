const http= require('http'),
    User= require('./models/user'),
    log = require('./utils/log'),
    {getClientIp} = require('./utils/utils');

http.createServer(function (req, res) {
    // 发送 HTTP 头部
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    let user=new User();

    user.getModelByPhone('').then(data=>{
        res.end(data);
    }).catch(err=>{
        log.write(getClientIp(req),err);
        //log.write('1111','2222');
        res.end(err);
    });
}).listen(8888);
