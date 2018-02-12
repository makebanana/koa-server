const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoTypeSchema = new Schema({
  parentId: { type: Number, required: true, default: 0 },
  id: { type: Number, required: true },
  label: { type: String, required: true },
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }]
});

module.exports = mongoose.model('PhotoType', PhotoTypeSchema);
