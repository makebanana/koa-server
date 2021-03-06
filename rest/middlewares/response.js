/*
* @ error-data 返回错误时，可携带的数据
* @ error-msg  自定义的错误提示信息
* @ error-status 错误返回码
* @ error-errdata 可返回服务器生成的错误
* @ success-data  请求成功时响应的数据
* @ success-msg  请求成功时响应的提示信息
* @ 调用ctx.error()   响应错误
* @ 调用ctx.success()  响应成功
*/

module.exports = async (ctx, next) => {
  ctx.success = ({ code = 200, data, message }) => {
    ctx.body = { code, message, data, success: true };
  };

  ctx.error = ({ data, message, status, error }) => {
    ctx.status = status || 400;
    ctx.body = { code: status || 400, message, data, error };
  };

  ctx.cant = () => {
    ctx.body = {
      code: 403,
      message: '没有相关权限'
    };
  };

  await next();
};
