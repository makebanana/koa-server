const { BackendManager } = require('../controllers/backend.export');

module.exports = async (ctx, next) => {
  const uid = ctx.state.user.id;
  ctx.canIuse = async (code) => {
    return await BackendManager.canIuse(uid, code);
  };
  await next();
};
