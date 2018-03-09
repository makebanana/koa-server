// Custom 401 handling if you don't want to expose koa-jwt errors to users
module.exports = async (ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 200;
      ctx.body = { code: 401, message: '登陆信息失效' };
    } else {
      throw err;
    }
  });
};
