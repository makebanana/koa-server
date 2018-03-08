const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  mobile: { type: Number, default: null },
  wechat: { type: String, default: null },
  sex: { type: String, enum: ['man', 'woman'] },
  birth: { type: Date, default: null },
  from: { type: String, enum: ['wx', 'mt', 'tg', 'qt'] },
  remark: { type: String, default: null },
  playList: [{ type: Schema.Types.ObjectId, ref: 'PlayRecord' }],
  createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', CustomerSchema);
