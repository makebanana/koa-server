const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  path: { type: String, required: true },
  size: { type: String, default: null },
});

module.exports = mongoose.model('Image', ImageSchema);
