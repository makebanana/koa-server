const mongoose = require ('mongoose');
const CustomerModel = mongoose.model('Customer');
const PlayRecordModel = mongoose.model('PlayRecord');

module.exports = class CostumerController {
  static async list (ctx) {
    if (!await ctx.canIuse(10001)) {
      return ctx.cant();
    }

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

    // '' new top . 1 old top
    sort = parseInt(sort) === 1 ? 'createTime' : '-createTime';

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
    if (!await ctx.canIuse(10001)) {
      return ctx.cant();
    }

    const id = ctx.params.id;
    const customer = await CustomerModel.findById(id);

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
    if (!await ctx.canIuse(10002)) {
      return ctx.cant();
    }

    let {
      name,
      mobile,
      wechat,
      sex,
      birth,
      from,
      remark,
      playList
    } = ctx.request.body;

    const add = await CustomerModel.create({ name, mobile, wechat, sex, birth, from, remark });

    ctx.success({
      message: '添加成功',
      data: {
        id: add.id
      }
    });

    // 创建记录
    playList.forEach(record => {
      record.customer = add.id;
    });
    PlayRecordModel.create(playList);
  }

  static async update (ctx) {
    if (!await ctx.canIuse(10002)) {
      return ctx.cant();
    }

    const id = ctx.params.id;
    const { name, mobile, wechat, sex, birth, from } = ctx.request.body;


    const result = await CustomerModel.findByIdAndUpdate(id, { name, mobile, wechat, sex, birth, from});
    ctx.success({
      code: result ? 200 : 400,
      message: result ? '修改成功' : '修改失败',
    });
  }

  static async del (ctx) {
    if (!await ctx.canIuse(10002)) {
      return ctx.cant();
    }

    const id = ctx.params.id;
    const del = await CustomerModel.findById(id);

    const result = await del.remove();
    if (result) {
      ctx.success({
        code: 200,
        message: '删除成功',
      });
      PlayRecordModel.find({ customer: result.id }).then(records => {
        records.forEach(record => {
          record.remove();
        });
      });
    } else {
      ctx.success({
        code: 400,
        message: '删除失败',
      });
    }
  }
};
