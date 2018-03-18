/**
 * Author:ll36
 * Create Time:2018/03/14 10:59
 * Descripttion:日志功能，抛错记录
 * 引用自https://github.com/mengdu/log.js
 * log('欢迎使用log.js。')
 log.info('这是info提示信息')
 log.success('这是success提示信息')
 log.error('这是error提示信息')
 log.warn('这是warn提示信息')
 //自定义用法
 log.addLog('test', 'cyan')
 log.test('这是自定义的log')
 */
const config = require('../config/log.config'),
    fs = require('fs');

let debug = true,
    absolute = false,
    path = require('path'),
    rootName = path.dirname(process.argv[1]);

const style = {
    'bold': ['\x1B[1m', '\x1B[22m'],
    'italic': ['\x1B[3m', '\x1B[23m'],
    'underline': ['\x1B[4m', '\x1B[24m'],
    'inverse': ['\x1B[7m', '\x1B[27m'],
    'strikethrough': ['\x1B[9m', '\x1B[29m'],

    'white': ['\x1B[37m', '\x1B[39m'],
    'grey': ['\x1B[90m', '\x1B[39m'],
    'black': ['\x1B[30m', '\x1B[39m'],
    'blue': ['\x1B[34m', '\x1B[39m'],
    'cyan': ['\x1B[36m', '\x1B[39m'],
    'green': ['\x1B[32m', '\x1B[39m'],
    'magenta': ['\x1B[35m', '\x1B[39m'],
    'red': ['\x1B[31m', '\x1B[39m'],
    'yellow': ['\x1B[33m', '\x1B[39m'],

    'whiteBG': ['\x1B[47m', '\x1B[49m'],
    'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG': ['\x1B[40m', '\x1B[49m'],
    'blueBG': ['\x1B[44m', '\x1B[49m'],
    'cyanBG': ['\x1B[46m', '\x1B[49m'],
    'greenBG': ['\x1B[42m', '\x1B[49m'],
    'magentaBG': ['\x1B[45m', '\x1B[49m'],
    'redBG': ['\x1B[41m', '\x1B[49m'],
    'yellowBG': ['\x1B[43m', '\x1B[49m']
};
// console.log('\x1B[47m\x1B[30m%s\x1B[39m\x1B[49m', 'hello') //白底黑色字

const stack = function () {
    let orig = Error.prepareStackTrace;

    Error.prepareStackTrace = function (_, _stack) {
        return _stack;
    };
    let err = new Error();

    Error.captureStackTrace(err, arguments.callee);
    let _stack = err.stack;

    Error.prepareStackTrace = orig;
    return _stack;
};


// const objToArr = function (obj) {
//     let k;
//     let arr = [];
//     for (k in obj) {
//         arr.push(obj[k]);
//     }
//     return arr;
// }

const getLocation = function (callsite) {
    let fileName = '';

    if (!absolute) {
        fileName = callsite.getFileName().replace(rootName, '').replace(new RegExp('^\\' + path.sep + ''), '');
    } else {
        fileName = callsite.getFileName();
    }
    return '\x1B[90m[' + fileName + ':' + callsite.getLineNumber() + ']\x1B[39m';
};

const show = function (callsite, type, args) {
    let css = style[type],
        params = [],
        i = 0, len = args.length;

    for (; i < len; i++) {
        let val = typeof args[i] === 'object' ? JSON.stringify(args[i]) : args[i];

        if (css) {
            params.push(css[0] + val + css[1]);
        } else {
            params.push(val);
        }
    }
    if (callsite) {
        params.unshift(getLocation(callsite));
    }
    return console.log.apply(null, params);
};

const log = function () {
    log.config(config);
    let callsite;

    if (debug) {
        callsite = stack()[1];
    }
    return show(callsite, '', arguments);
};

log.config = function (op) {
    debug = typeof op.debug === 'undefined' ? true : op.debug;
    absolute = op.absolute || false;
};

log.info = function () {
    let callsite;

    if (debug) {
        callsite = stack()[1];
    }
    return show(callsite, 'blue', arguments);
};
log.success = function () {
    let callsite;

    if (debug) {
        callsite = stack()[1];
    }
    return show(callsite, 'green', arguments);
};
log.warn = function () {
    let callsite;

    if (debug) {
        callsite = stack()[1];
    }
    return show(callsite, 'yellow', arguments);
};
log.error = function () {
    let callsite;

    if (debug) {
        callsite = stack()[1];
    }
    return show(callsite, 'red', arguments);
};
log.write = function () {
    let callsite = debug ? stack()[1] : null;
    let content = (arguments.length ? Array.prototype.slice.call(arguments).join('=>') : '') + '\r\n' + '==================\r\n';

    fs.appendFile(path.resolve('./') + '/logs/log.txt', content, 'utf8', function (err) {
        if (err) {
            log.error(err);
        }
    });
    if (debug) {
        return show(callsite, 'red', arguments);
    }
};
log.addLog = function (name, type) {
    if (!name) {
        throw new Error('参数1必须传！');
    }
    else{
        log[name] = function () {
            let callsite;

            if (debug) {
                callsite = stack()[1];
            }
            return show(callsite, type, arguments);
        };
    }
};

module.exports = log;
