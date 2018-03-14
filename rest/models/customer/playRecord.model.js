const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PhotoModel = mongoose.model('Photo');

const PlayRecordSchema = new Schema({
  type: [{ type: Schema.Types.ObjectId, ref: 'PhotoType' }],
  photo: { type: Schema.Types.ObjectId, ref: 'Photo' },
  customer: { type: Schema.Types.ObjectId, ref: 'Photo' },
  createTime: { type: Date, default: Date.now }
});

// 更新对应的图片计数
PlayRecordSchema.pre('save', async function(next){
  try{
    PhotoModel.updateCount(this.photo);
    return next();
  }catch(e){
    return next(e);
  }
});

PlayRecordSchema.pre('remove', async function(next){
  try{
    PhotoModel.updateCount(this.photo, true);
    return next();
  }catch(e){
    return next(e);
  }
});

module.exports = mongoose.model('PlayRecord', PlayRecordSchema);
