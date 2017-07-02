import path from 'path';
import express from 'express';
import session from 'express-session';
import mongoConnect from 'connect-mongo';
import flash from 'connect-flash';
import configLite from 'config-lite';
import winston from 'winston';
import expressWinston from 'express-winston';
import routes from './routes';
import pkg from './package.json';

const app = express();
const MongoStore = mongoConnect(session);
const config = configLite({
  filename: 'default',
  config_basedir: __dirname,
  config_dir: 'config',
});

console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);
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
    maxAge: config.session.maxAge, // 设置过期时间 过期后cookie中的session id 自动删除
  },
  store: new MongoStore({// 将session 存储到mongodb
    url: config.mongodb,  // mongodb地址
  }),
}));
// flash 中间件，用来显示通知
app.use(flash());
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
  keepExtensions: true, // 保留后缀
}));

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description,
};

// 添加模板必需的三个变量
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// 记录正常请求日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true,
    }),
    new (winston.transports.File)({
      name: 'success-file',
      filename: 'logs/success.log',
    }),
  ],
}));

// 使用路由
routes(app);

// 记录错误请求日志
app.use(expressWinston.errorLogger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true,
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
}));

// error page
app.use((err, req, res, next) => {
  res.render('error', { error: err });
});

// 监听端口
app.listen(config.port, () => {
  console.log('%s listening on port %s', pkg.name, config.port);
});
