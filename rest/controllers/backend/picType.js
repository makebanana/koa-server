const mongoose = require ('mongoose');
const PhotoType = mongoose.model('PhotoType');

module.exports = class PicTypeController {
  static async list (ctx) {
    let list = await PhotoType.find();

    list = list.map(({ _id, label, id, parentId, photos }) => ({
      _id,
      label,
      id,
      parentId,
      count: photos.length
    }));

    ctx.success({
      data: {
        list
      }
    });
  }

  static async add (ctx) {
    let { label, parentId = 0 } = ctx.request.body;

    const hasSame = await PhotoType.find({ label });
    if (hasSame.length) {
      ctx.success({
        code: 400,
        message: '已存在相同名称的分类',
      });
      return;
    }

    const bigList = await PhotoType.find().sort('-id').limit(1);
    const id = bigList[0] ? bigList[0].id + 1 : 1;
    const add = await PhotoType.create({ label, parentId, id});

    ctx.success({
      message: '添加成功',
      data: {
        id,
        _id: add._id
      }
    });
  }

  static async update (ctx) {
    let id = ctx.params.id;
    let label = ctx.request.body.label;

    if (!label) {
      ctx.success({
        code: 400,
        message: '内容不能为空',
      });
      return ;
    }

    const result = await PhotoType.update({ id }, { label });
    ctx.success({
      code: result.ok ? 200 : 400,
      message: result.ok ? '修改成功' : '修改失败',
    });
  }

  static async del (ctx) {
    let id = ctx.params.id;

    const del = await PhotoType.findOne({ id });

    if (!del) {
      ctx.success({
        code: 400,
        message: '该分类已被删除',
      });
      return;
    }

    if (del.parentId === 0) {
      const child = await PhotoType.find({ parentId: del.id });

      if (child.length) {
        ctx.success({
          code: 400,
          message: '请先删除该分类下的子类',
        });
        return;
      }
    }

    if (del.photos.length) {
      ctx.success({
        code: 400,
        message: '该分类上还有相片，请先解除关联',
      });
      return;
    }

    const result = await del.remove();
    ctx.success({
      code: result ? 200 : 400,
      message: result ? '删除成功' : '删除失败',
    });
  }
};
