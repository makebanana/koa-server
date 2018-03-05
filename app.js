const Koa = require('koa');
const app = new Koa();
const convert = require('koa-convert');
const onerror = require('koa-onerror');
const bodyParser = require('koa-bodyparser')();
const logger = require('koa-logger');
const path = require('path');
const koaBody = require('koa-body');
const jwt = require('koa-jwt');
const config = require('./config')[process.env.NODE_ENV || 'development'];

require('./rest/models/db');

// const json = require('koa-json')

const backendRouter = require('./rest/routers/backend');

app.use(convert(logger()))
   .use(require('koa-static')(path.resolve(__dirname) + '/public'));

onerror(app);

app.use(koaBody({
  formLimit: 10485760,  // 最大1M
  formidable:{
    keepExtensions: true, // 带拓展名上传，否则上传的会是二进制文件而不是图片文件
  },
  multipart:true
}));

// 使用ctx.body解析中间件
app.use(bodyParser);

app.use(jwt({ secret: config.jwtSecret }).unless({ path:[/^\/server\/login/, /^\/server\/register/] }));

// app.use(async (ctx, next) => {
//   const start = new Date();
//   await next();
//   const ms = new Date() - start;
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// });

// router
app.use(require('./rest/middlewares/response'));
app.use(require('./rest/middlewares/filter'));
app.use(backendRouter.routes()).use(backendRouter.allowedMethods());

// response
app.on('error', function (err, ctx) {
  console.log('server error', err, ctx);
  ctx.status = 400;
  ctx.body = { code: 400, message: ' 服务器错误!', error: err};
});

module.exports = app;
