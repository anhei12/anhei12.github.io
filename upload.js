'use strict'
// 引入scp2
var client = require('scp2');
// 下面三个插件是部署的时候控制台美化所用 可有可无
const ora = require('ora');
const chalk = require('chalk');
const spinner = ora(chalk.green('正在上传到到服务器...'));
spinner.start();

client.scp('C:/Users/86156/Desktop/vue_shop4-master', {    // 本地打包文件的位置
  "host": 'http://anh.host3v.com/', // 服务器的IP地址
  "port": '21',            // 服务器端口， 一般为 22
  "username": 'anh',       // 服务器用户名，一般是root
  "password": 'cxg15687cxg',     // 服务器密码
  "path": ''            // 项目部署的服务器目标位置
}, err =>{
  spinner.stop();
  if (!err) {
    console.log(chalk.green("项目上传完成"))
  } else {
    console.log("err", err)
  }
})