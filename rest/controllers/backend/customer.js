const mongoose = require ('mongoose');
const CustomerModel = mongoose.model('Customer');
const PhotoModel = mongoose.model('Photo');
const PlayRecordModel = mongoose.model('PlayRecord');

module.exports = class CostumerController {
  static async list (ctx) {
    let {
      pageNo = 1,
      pageSize = 10,
      searchType = 0,
      sort = 0,
      key = '',
      from = ''
    } = ctx.query;
    const params = {};

    // [name, phone, wx]
    searchType = parseInt(searchType) || 0;
    searchType = searchType > 3 ? 0 : searchType;

    // trim
    key = key.trim();
    if (key) {
      // search key regexp
      key = new RegExp(key);
      params[['name', 'phone', 'wx'][searchType]] = key;
    }

    // trim
    from = from.trim();
    if (from) { params.from = from; }

    // 1 new top . 2 old top
    sort = parseInt(sort) === 2 ? 'createTime' : '-createTime';

    // pageNo
    pageNo = parseInt(pageNo) || 1;

    // pageSize
    pageSize = parseInt(pageSize) || 10;

    const recordTotal = await CustomerModel.find(params).count();
    const customers = await CustomerModel.find(params)
    .sort(sort)
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize);

    const data = {
      recordTotal,
      pageSize,
      pageNo,
      customers
    };
    ctx.success({ data });
  }

  static async detail (ctx) {
    const id = ctx.params.id;
    const customer = await CustomerModel.findById(id).populate({
      path: 'playList',
      select: 'photo createTime',
      populate: {
        path: 'photo',
        select: 'name pictures',
        populate: {
          path: 'pictures',
          select: 'path -_id'
        }
      }
    });

    const playList = customer.playList.map(({ createTime, _id, photo }) => ({
      _id,
      createTime,
      name: photo.name,
      cover: photo.pictures[0].path
    }));

    if (customer) {
      ctx.success({
        data: {
          customer: {
            _id: customer._id,
            name: customer.name,
            mobile: customer.mobile,
            wechat: customer.wechat,
            from: customer.from,
            sex: customer.sex,
            remark: customer.remark,
            birth: customer.birth,
            playList
          }
        }
      });
    } else {
      ctx.success({
        code: 400,
        message: '该用户不存在'
      });
    }
  }

  static async add (ctx) {
    let { name, mobile, wechat, sex, birth, from, remark, playList } = ctx.request.body;

    const recordList = await PlayRecordModel.create(playList);
    playList = recordList.map(item => item.id);

    const add = await CustomerModel.create({ name, mobile, wechat, sex, birth, from, remark, playList });

    ctx.success({
      message: '添加成功',
      data: {
        id: add.id
      }
    });

    const needUpdatePhotoIds = recordList.map(record => record.photo);
    PhotoModel.updateCount(needUpdatePhotoIds);
  }

  static async update (ctx) {
    const id = ctx.params.id;
    const { name, mobile, wechat, sex, birth, from } = ctx.request.body;


    const result = await CustomerModel.findByIdAndUpdate(id, { name, mobile, wechat, sex, birth, from});
    ctx.success({
      code: result ? 200 : 400,
      message: result ? '修改成功' : '修改失败',
    });
  }

  static async del (ctx) {
    const id = ctx.params.id;
    const del = await CustomerModel.findById(id).populate('playList');

    const result = await del.remove();
    if (result) {
      ctx.success({
        code: 200,
        message: '删除成功',
      });
      const photoList = del.playList.map(record => record.photo);
      PhotoModel.updateCount(photoList, true);
    } else {
      ctx.success({
        code: 400,
        message: '删除失败',
      });
    }
  }
};
