'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1546786015205_7361';

  // add your config here
  config.middleware = [];
  //配置数据库信息
  config.sequelize={
    dialect:'mysql',
    host:'127.0.0.1',
    port:3306,
    database:'yhj',
    username:'root',
    password:'root'
  }
  // config.default.js

  // egg.js默认加载了koa2的crsf验证机制，小程序又不允许cookie，就得取消crsf接口验证了
// 关闭csrf
config.security = {
  csrf: {
    enable: false,
    ignoreJSON: true,
  },
  // 白名单
  domainWhiteList: [ 'http://localhost:3000/'],
};

// 允许规则
config.cors = {
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  origin:'*'
};
  return config;
};
