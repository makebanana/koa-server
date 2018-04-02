const Koa = require('koa');
const app = new Koa();
const convert = require('koa-convert');
const onerror = require('koa-onerror');
const logger = require('koa-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser')();
const jwt = require('koa-jwt');
const path = require('path');
const config = require('./config')[process.env.NODE_ENV || 'development'];

// db regist
require('./rest/models/db');

// logger
app.use(convert(logger()));

// static page
app.use(serve(path.join(__dirname, '..', 'dist')));

// error
onerror(app);

// post body
app.use(koaBody({
  formLimit: 10485760,  // 最大1M
  formidable:{
    keepExtensions: true, // 带拓展名上传，否则上传的会是二进制文件而不是图片文件
  },
  multipart:true
}));

// 使用ctx.body解析中间件
app.use(bodyParser);

// token error catch
app.use(require('./rest/middlewares/tokenError'));

// token check and unless
app.use(jwt({ secret: config.jwtSecret }).unless({ path:[/^\/server\/login/, /^\/server\/register/] }));

// response quiky api
app.use(require('./rest/middlewares/response'));

// catch uncatch error
app.use(require('./rest/middlewares/filter'));

// auth check
app.use(require('./rest/middlewares/apiAuthMap'));

// rest api router
const backendRouter = require('./rest/routers/backend');
app.use(backendRouter.routes()).use(backendRouter.allowedMethods());

// response
app.on('error', function (err, ctx) {
  console.log('server error', err, ctx);
  ctx.status = 400;
  ctx.body = { code: 400, message: ' 服务器错误!', error: err};
});

module.exports = app;
