const mongoose = require ('mongoose');
const PlayRecordModel = mongoose.model('PlayRecord');

module.exports = class PlayRecordController {
  static async list (ctx) {
    const customerId = ctx.params.customerId;

    const result = await PlayRecordModel.find({ customer: customerId }, 'photo createTime').populate({
      path: 'photo',
      select: 'name pictures',
      populate: {
        path: 'pictures',
        select: 'path -_id'
      }
    });

    const playList = result.map(({ createTime, _id, photo }) => ({
      _id,
      createTime,
      name: photo.name,
      cover: photo.pictures[0].path
    }));

    ctx.success({
      message: '添加成功',
      data: {
        playList
      }
    });
  }

  static async add (ctx) {
    const { type, photo, createTime } = ctx.request.body;
    const customerId = ctx.params.customerId;

    const record = await PlayRecordModel.create({ type, photo, createTime, customer: customerId });

    ctx.success({
      message: '添加成功',
      data: {
        id: record.id
      }
    });
  }

  static async del (ctx) {
    const id = ctx.params.id;

    const del = await PlayRecordModel.findById(id);

    if (!del) {
      ctx.success({
        code: 400,
        message: '该记录不存在',
      });
      return;
    }

    const result = await del.remove();
    if (result) {
      ctx.success({
        code: 200,
        message: '删除成功',
      });
    } else {
      ctx.success({
        code: 400,
        message: '删除失败',
      });
    }
  }
};
