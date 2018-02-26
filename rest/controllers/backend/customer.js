const mongoose = require ('mongoose');
const CustomerModel = mongoose.model('Customer');

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
    .limit(pageSize)
    .populate('produce', 'name -_id');

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
    const customer = await CustomerModel.findById(id).populate('produce');

    if (customer) {
      ctx.success({
        data: {
          customer
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
    let { name, mobile, wechat, sex, birth, from, produce } = ctx.request.body;

    const add = await CustomerModel.create({ name, mobile, wechat, sex, birth, from, produce });

    ctx.success({
      message: '添加成功',
      data: {
        id: add.id
      }
    });
  }

  static async update (ctx) {
    const id = ctx.params.id;
    const { name, mobile, wechat, sex, birth, from, produce } = ctx.request.body;


    const result = await CustomerModel.update({_id: id}, { name, mobile, wechat, sex, birth, from, produce});
    ctx.success({
      code: result.ok ? 200 : 400,
      message: result.ok ? '修改成功' : '修改失败',
    });
  }

  static async del (ctx) {
    const id = ctx.params.id;
    const del = await CustomerModel.findByIdAndRemove(id).exec();
    ctx.success({
      code: del ? 200 : 400,
      message: del ? '删除成功' : '删除失败',
    });
  }
};
