const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  name: { type: String, required: true },
  intro: { type: String, default: null },
  type: [{ type: Schema.Types.ObjectId, ref: 'PhotoType' }],
  customerCount: { type:  Number, default: 0 },
  pictures: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photo', PhotoSchema);
