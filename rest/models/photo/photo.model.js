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

PhotoSchema.static('updateCount', function(id, isDel) {
  this.findByIdAndUpdate(id, { $inc: { customerCount: isDel ? -1 : 1 } });
});

module.exports = mongoose.model('Photo', PhotoSchema);
