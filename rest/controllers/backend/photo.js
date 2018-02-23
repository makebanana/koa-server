const mongoose = require ('mongoose');
const PhotoModel = mongoose.model('Photo');

module.exports = class PhotoController {
  static async list (ctx) {
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

    //type id
    tid = tid.trim();

    const recordTotal = await PhotoModel.find(params).count();
    const photos = await PhotoModel.find(params)
    .sort(sort)
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .populate('type', 'label -_id')
    .then(list => list.map(({ name, intro, type, customerCount, cover, pictures, createTime }) => {
      return {
        name,
        intro,
        customerCount,
        cover,
        pictures,
        createTime,
        type : type[1].label || ''
      };
    }));

    let data = {
      recordTotal,
      pageSize,
      pageNo,
      photos
    };
    ctx.success({ data });
  }

  static async detail (ctx) {
    let id = ctx.params.id;
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
        message: '没有对应的管理员'
      });
    }
  }

  static async add (ctx) {
    let { name, intro, pictures, type } = ctx.request.body;

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
    let id = ctx.params.id;
    let { name, intro, pictures, type  } = ctx.request.body;

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
    let id = ctx.params.id;
    const del = await PhotoModel.findByIdAndRemove(id).exec();
    ctx.success({
      code: del ? 200 : 400,
      message: del ? '删除成功' : '删除失败',
    });
  }
};
