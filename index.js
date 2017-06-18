var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite')({
  filename: 'default',
  config_basedir: __dirname,
  config_dir: 'config'
});
var routes = require('./routes');
var pkg = require('./package');

var app = express();
console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV);
// 设置模板
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎 ejs
app.set('view engine', 'ejs');

// 设置静态资源目录
app.use(express.static(path.join(__dirname, 'public')));
// session中间件
app.use(session({
  name: config.session.key, // 设置 cookies 中保存session id的字段名称
  secret: config.session.secret, // 通过设置secret来计算hash值并放在cookie中，使得产生的signedCookie防篡改
  resave: true, // 强制更新session
  saveUninitialized: false, // 设置false 强制创建一个session，即时用户未登录
  cookie: {
    maxAge: config.session.maxAge // 设置过期时间 过期后cookie中的session id 自动删除
  },
  store: new MongoStore({// 将session 存储到mongodb
    url: config.mongodb  // mongodb地址
  })
}));
// flash 中间件，用来显示通知
app.use(flash());
// 使用路由
routes(app);

// 监听端口
app.listen(config.port, function () {
  console.log('%s listening on port %s', pkg.name, config.port);
});
