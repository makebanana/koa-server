const mongoose = require ('mongoose');
const CustomerModel = mongoose.model('Customer');

module.exports = class CostumerController {
  static async list (ctx) {
    let {
      pageNo = 1,
      pageSize = 10,
      searchType = 0,
      key = '',
      from = '',
      sort = ''
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
      params[['name', 'phone', 'wx'][searchType]] = key
    }

    // trim
    from = from.trim();
    if (from) { params.from = from }

    // 1 new top . 2 old top
    sort = parseInt(sort) === 2 ? 'createTime' : '-createTime';

    // pageNo
    pageNo = parseInt(pageNo) || 1;

    // pageSize
    pageSize = parseInt(pageSize) || 10;

    const recordTotal = await CustomerModel.find(params).count();
    const customers = await CustomerModel.find(params).sort(sort).skip((pageNo - 1) * pageSize).limit(pageSize)

    let data = {
      recordTotal,
      pageSize,
      pageNo,
      customers
    }
    ctx.success({ data })
  }

  static detail (ctx) {
    // let id = parseInt(ctx.params.id)
    ctx.success({
      data: {}
    })
  }

  static add (ctx) {
    ctx.success({
      message: '新增成功',
      data: {
        id: 123
      }
    })
  }

  static async update (ctx) {
    // let { name, password } = ctx.request.body
    ctx.success({
      message: '修改成功',
      data: {}
    })
  }

  static async del (ctx) {
    // let id = ctx.request.body.id
    ctx.success({
      message: '删除成功',
      data: {}
    })
  }
}
