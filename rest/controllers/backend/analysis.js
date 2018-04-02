const mongoose = require ('mongoose');
const CustomerModel = mongoose.model('Customer');
const PlayRecordModel = mongoose.model('PlayRecord');
const PhotoModel = mongoose.model('Photo');

module.exports = class AnalysisController {
  static async customer (ctx) {
    if (!await ctx.canIuse(50002)) {
      return ctx.cant();
    }

    const now = Date.now();
    const tempFrom = {
      'wx': 0,
      'mt': 0,
      'tg': 0,
      'qt': 0
    };
    const tempAge = {};
    await CustomerModel.find().then(customers => {
      customers.forEach(customer => {
        if (!customer.birth) {
          tempAge['other'] = (tempAge['other'] || 0) + 1;
        } else {
          let key = Math.ceil((customer.birth - now) / (1000 * 60 * 60 * 24 * 30 * 12 * 10)) * 10;
          if ( key > 50 ) {
            key = '50+';
          } else {
            key = `${key - 10}-${key}`;
          }

          tempAge[key] = (tempAge[key] || 0) + 1;
        }

        tempFrom[customer.from] = tempFrom[customer.from] + 1;
      });
    });

    ctx.success({
      data: {
        from: Object.entries(tempFrom).map(([label, value]) => ({label, value})),
        age: Object.entries(tempAge).map(([label, value]) => ({label, value}))
      }
    });
  }

  static async photo (ctx) {
    if (!await ctx.canIuse(50001)) {
      return ctx.cant();
    }

    const tempType = {};
    const tempCount = {};
    await PhotoModel
      .find()
      .sort('customerCount')
      .populate('type')
      .then(photos => {
        photos.forEach(({ customerCount, type: [, { label }]}) => {
          tempType[label] = (tempType[label] || 0) + 1;

          if (customerCount) {
            tempCount[label] = (tempCount[label] || 0) + customerCount;
          }
        });
      });

    const tempPhoto = {};
    await PlayRecordModel
      .find()
      .populate('photo', 'name')
      .then(records => {
        records.forEach(({photo: { name }})  => {
          tempPhoto[name] = (tempPhoto[name] || 0) + 1;
        });
      });

    ctx.success({
      data: {
        type: Object.entries(tempType).map(([label, value]) => ({label, value})),
        count: Object.entries(tempCount).map(([label, value]) => ({label, value})),
        photo: Object.entries(tempPhoto).map(([label, value]) => ({label, value})),
      }
    });
  }
};
