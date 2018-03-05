const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayRecordSchema = new Schema({
  type: [{ type: Schema.Types.ObjectId, ref: 'PhotoType' }],
  product: { type: Schema.Types.ObjectId, ref: 'Photo' },
  createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlayRecord', PlayRecordSchema);
