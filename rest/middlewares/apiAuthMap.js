const { BackendManager } = require('../controllers/backend.export');

module.exports = async (ctx, next) => {
  if (ctx.state && ctx.state.user && ctx.state.user.id) {
    const uid = ctx.state.user.id;
    ctx.canIuse = async (code) => {
      return await BackendManager.canIuse(uid, code);
    };
  }

  await next();
};
