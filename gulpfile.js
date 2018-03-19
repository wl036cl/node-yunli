/**
 * Author:ll36
 * Create Time:2018/03/16 16:52
 * Descripttion:gulp配置
 */
const gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload;

// 使用 nodemone 跑起服务器
gulp.task('watchServer', function () {
  nodemon({ // called on start
    script: 'api.js',
    //ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
    // ignore : [
    //     "logs/**",
    //     "node_modules/**"
    // ]
    //watch: ['controllers/user.js']
  });
});
gulp.task('watchClient', ['watchServer'], function () {
  const files = [
    'api.js',
    'index.html',
    '+(config|controllers|models|utils)/*.js'
  ];

  browserSync.init(files, {
    proxy: 'http://localhost:3000',
    browser: 'chrome',
    port: 7000
  });
  gulp.watch(files).on('change', reload);
});
gulp.task('default', ['watchClient'], function () {
  console.log('执行完毕');
});