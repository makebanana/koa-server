const tokenMaker = require('jsonwebtoken');
const mongoose = require ('mongoose');
const ManagerModel = mongoose.model('Manager');
const config = require('../../../config')[process.env.NODE_ENV || 'development'];

module.exports = class ManagerController {
  static async login (ctx) {
    const { mobile, password } = ctx.request.body;

    if (!mobile) {
      return ctx.error({
        message: '请输入用户名!'
      });
    }

    if (!password) {
      return ctx.error({
        message: '请输入密码!'
      });
    }

    try{
      const manager = await ManagerModel.findOne({ mobile });
      const isMatch = await manager.comparePassword(password);
      if (!isMatch) {
        return ctx.success({
          code: 423,
          message: '用户名或密码错误!'
        });
      }

      const token = tokenMaker.sign(
        {
          id: manager._id,
          secret: manager.appSecret
        },
        config.jwtSecret,
        { expiresIn: '12h' }
      );

      manager.ip = ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress;
      manager.lastLoginTime = new Date();
      manager.save();

      ctx.success({
        message: '登陆成功',
        data: {
          authorization: token,
          id: manager.id,
          name: manager.name
        }
      });
    }catch(e){
      return ctx.success({
        code: 423,
        message: '用户名或密码错误!'
      });
    }
  }

  static async list (ctx) {
    if (!await ctx.canIuse(60000)) {
      return ctx.cant();
    }

    let {
      pageNo = 1,
      pageSize = 10,
      sort = 0
    } = ctx.query;

    sort = ['createTime', '-createTime', 'lastLoginTime', '-lastLoginTime'][parseInt(sort)];

    // pageNo
    pageNo = parseInt(pageNo) || 1;

    // pageSize
    pageSize = parseInt(pageSize) || 10;

    const recordTotal = await ManagerModel.find().count();
    const managers = await ManagerModel.find({ mobile: { $nin: [13777847949] }}).sort(sort).skip((pageNo - 1) * pageSize).limit(pageSize);

    let data = {
      recordTotal,
      pageSize,
      pageNo,
      managers
    };
    ctx.success({ data });
  }

  static async detail (ctx) {
    if (!await ctx.canIuse(60000)) {
      return ctx.cant();
    }

    let id = ctx.params.id;
    const manager = await ManagerModel.findById(id).populate('auth');

    if (manager) {
      ctx.success({
        data: {
          manager
        }
      });
    } else {
      ctx.success({
        code: 400,
        message: '没有对应的管理员'
      });
    }
  }

  static async add (ctx) {
    if (!await ctx.canIuse(60000)) {
      return ctx.cant();
    }

    let { mobile, password, name, auth } = ctx.request.body;

    const hasSame = await ManagerModel.find({ mobile });
    if (hasSame.length) {
      ctx.success({
        code: 400,
        message: '已存在该手机号',
      });
      return;
    }

    const add = await ManagerModel.create({ mobile, password, name, auth });

    ctx.success({
      message: '添加成功',
      data: {
        id: add.id
      }
    });
  }

  static async update (ctx) {
    if (!await ctx.canIuse(60000)) {
      return ctx.cant();
    }

    let id = ctx.params.id;
    let { name, password, auth  } = ctx.request.body;

    const manager = await ManagerModel.findById(id);

    if (!manager) {
      return ctx.success({
        code: 404,
        message: '该管理员不存在',
      });
    }

    if ([13777847949].includes(manager.mobile)) {
      return ctx.success({
        code: 403,
        message: '没有修改权限',
      });
    }

    const updateData = {
      name,
      auth
    };

    if (password) {
      updateData.password = password;
    }

    const result = await ManagerModel.findByIdAndUpdate(id, updateData);

    ctx.success({
      code: result ? 200 : 400,
      message: result ? '修改成功' : '修改失败',
    });
  }

  static async del (ctx) {
    if (!await ctx.canIuse(60000)) {
      return ctx.cant();
    }

    let id = ctx.params.id;
    const del = await ManagerModel.findByIdAndRemove(id);
    ctx.success({
      code: del ? 200 : 400,
      message: del ? '删除成功' : '删除失败',
    });
  }

  static async canIuse (uid, id) {
    const manager = await ManagerModel.findOne({ _id: uid }).select('auth -_id').populate('auth');
    console.log('manager', manager);
    const hasAuth = manager.auth.map(auth => auth.id);
    console.log(hasAuth);
    console.log(hasAuth.includes(id), id);
    return hasAuth.includes(id);
  }
};
