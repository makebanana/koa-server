const mongoose = require ('mongoose');
const PlayRecordModel = mongoose.model('playRecord');
const PhotoModel = mongoose.model('photo');
const CustomerModel = mongoose.model('Customer');

module.exports = class PlayRecordController {
  static async add (ctx) {
    const { type, photo, createTime } = ctx.request.body;
    const phtotoId = ctx.params.photoId;

    const record = await PlayRecordModel.create({ type, photo, createTime });

    ctx.success({
      message: '添加成功',
      data: {
        id: record.id
      }
    });

    PhotoModel.updateCount(photo);
    CustomerModel.findById(phtotoId).then(photo => {
      photo.playList.push(record.id);
      photo.save();
    });
  }

  static async del (ctx) {
    const phtotoId = ctx.params.photoId;
    const id = ctx.params.id;

    const del = await PlayRecordModel.findOne({ id });

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

      PhotoModel.updateCount(del.photo, true);
      CustomerModel.findById(phtotoId).then(photo => {
        photo.playList = photo.playList.filter(record => record !== id);
        photo.save();
      });
    } else {
      ctx.success({
        code: 400,
        message: '删除失败',
      });
    }
  }
};
