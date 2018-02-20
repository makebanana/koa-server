const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  path: { type: String, required: true },
  size: { type: String, default: null },
  createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', ImageSchema);
