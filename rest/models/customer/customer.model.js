const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  wechat: { type: String, default: null },
  sex: { type: String, enum: ['man', 'woman'] },
  birth: { type: Date, default: null },
  from: { type: String, enum: ['wx', 'mt', 'tg', 'qt'] },
  remark: { type: String, default: null },
  produce: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
  createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', CustomerSchema);
