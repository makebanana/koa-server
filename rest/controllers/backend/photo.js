const mongoose = require ('mongoose');
const PhotoModel = mongoose.model('Photo');

module.exports = class PhotoController {
  static async list (ctx) {
    if (!await ctx.canIuse(20001)) {
      return ctx.cant();
    }

    let {
      pageNo = 1,
      pageSize = 10,
      sort = 0,
      key = '',
      tid = ''
    } = ctx.query;
    const params = {};

    sort = ['createTime', '-createTime', 'customerCount', '-customerCount'][parseInt(sort)];

    // pageNo
    pageNo = parseInt(pageNo) || 1;

    // pageSize
    pageSize = parseInt(pageSize) || 10;

    // key
    params.name = new RegExp(key.trim());

    if (tid.trim()) {
      params.type = tid.trim();
    }

    const recordTotal = await PhotoModel.find(params).count();
    const photos = await PhotoModel.find(params)
    .sort(sort)
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .populate('type pictures')
    .then(list => list.map(({ _id, name, intro, type, customerCount, pictures, createTime }) => {
      return {
        _id,
        name,
        intro,
        customerCount,
        pictures,
        createTime,
        cover: pictures[0] ? pictures[0].path : '',
        type : type[1].label || ''
      };
    }));

    const data = {
      recordTotal,
      pageSize,
      pageNo,
      photos
    };
    ctx.success({ data });
  }

  static async detail (ctx) {
    if (!await ctx.canIuse(20001)) {
      return ctx.cant();
    }

    const id = ctx.params.id;
    const photo = await PhotoModel.findById(id).populate('pictures');

    if (photo) {
      ctx.success({
        data: {
          photo
        }
      });
    } else {
      ctx.success({
        code: 400,
        message: '该相片不存在'
      });
    }
  }

  static async add (ctx) {
    if (!await ctx.canIuse(20002)) {
      return ctx.cant();
    }

    const { name, intro, pictures, type } = ctx.request.body;

    const hasSame = await PhotoModel.find({ name });
    if (hasSame.length) {
      ctx.success({
        code: 400,
        message: '已经存在同样名称的相片',
      });
      return;
    }

    const add = await PhotoModel.create({ name, intro, pictures, type });

    ctx.success({
      message: '添加成功',
      data: {
        id: add.id
      }
    });
  }

  static async update (ctx) {
    if (!await ctx.canIuse(20002)) {
      return ctx.cant();
    }

    const id = ctx.params.id;
    const { name, intro, pictures, type } = ctx.request.body;

    const hasSame = await PhotoModel.find({ name });

    if (hasSame.length && hasSame[0].id !== id) {
      ctx.success({
        code: 400,
        message: '已经存在同样名称的相片',
      });
      return;
    }

    const result = await PhotoModel.update({_id: id}, { name, intro, pictures, type });
    ctx.success({
      code: result.ok ? 200 : 400,
      message: result.ok ? '修改成功' : '修改失败',
    });
  }

  static async del (ctx) {
    if (!await ctx.canIuse(20002)) {
      return ctx.cant();
    }

    const id = ctx.params.id;
    const del = await PhotoModel.findById(id);

    if (del.customerCount > 0) {
      return ctx.success({
        code: 400,
        message: '删除失败，该相片还有关联的用户',
      });
    }

    const result = await del.remove();
    ctx.success({
      code: result ? 200 : 400,
      message: result ? '删除成功' : '删除失败',
    });
  }
};
