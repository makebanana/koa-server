const mongoose = require ('mongoose');
const ManagerModel = mongoose.model('Manager');
const AuthModel = mongoose.model('Auth');

module.exports = class AuthController {
  static async has (ctx) {
    const manager = await ManagerModel.findOne({ _id: ctx.state.user.id }).populate('auth');

    if (!manager) {
      ctx.success({
        code: 400,
        message: '获取权限错误'
      });
      return;
    }

    ctx.success({
      data: {
        auth: manager.auth.map(({ id, parentId, name }) => {
          return {
            id,
            parentId,
            name
          };
        })
      }
    });
  }

  static async list (ctx) {
    const auth = await AuthModel.find()
    .then(auths => auths.filter(auth => auth.id !== 60000));

    ctx.success({
      data: {
        auth
      }
    });
  }
};
