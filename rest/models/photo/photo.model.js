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

PhotoSchema.static('updateCount', function(ids, isDel) {
  const idArr = Array.isArray(ids) ? ids : [ids];
  this.find({ _id: { $in: idArr }}).then(photos => {
    photos.forEach(photo => {
      const customerCount = photo.customerCount;

      if (isDel && customerCount <= 0) { return; }

      photo.customerCount = customerCount + ( isDel ? -1 : 1 );
      photo.save();
    });
  });
});

module.exports = mongoose.model('Photo', PhotoSchema);
