const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto = require('crypto');
const config = require('../../../config')[process.env.NODE_ENV || 'development'];

const ManagerSchema = new Schema({
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, default: null },
  ip: { type: String, default: null },
  auth: [{ type: Schema.Types.ObjectId, ref: 'Auth' }],
  appSecret: { type: String, default: GetHmac() },
  lastLoginTime: { type: Date, default: null },
  createTime: { type: Date, default: Date.now }
});


function GetHmac(){
  const hmac = crypto.createHmac('sha256', config.secretKey);
  hmac.update(Date.now().toString());
  return hmac.digest('hex');
}

ManagerSchema.pre('save', async function(next){
  try{
    const manager = this;
    if(!manager.isModified('password')) return next();
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(this.password, salt);
    manager.password = hash;
    return next();
  }catch(e){
    return next(e);
  }
});

ManagerSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

ManagerSchema.statics.canManage = (id, moduleId) => {
  return this.findById(id).then(manager => manager && manager.auth.includes(moduleId));
};

ManagerSchema.statics.checkToken = async function (token) {
  const secret = GetHmac();
  const manager = await this.findOneAndUpdate({ _id: token.id }, { appSecret: secret });
  if(token.secret === manager.appSecret){
    manager.appSecret = secret;
    //console.log('user user: ', user)
    return manager;
  }else{
    throw new Error('no match!');
  }
};

module.exports = mongoose.model('Manager', ManagerSchema);
