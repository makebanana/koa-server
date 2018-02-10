const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManagerSchema = new Schema({
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, default: null },
  ip: { type: String, default: null },
  auth: [{ type: Schema.Types.ObjectId, ref: 'Auth' }],
  token: { type: String, default: null },
  lastLoginTime: { type: Date, default: null },
  createTime: { type: Date, default: Date.now }
});

ManagerSchema.statics = {
  canManage (id, moduleId) {
    return this.findById(id).then(manager => manager && manager.auth.includes(moduleId));
  }
}

module.exports = mongoose.model('Manager', ManagerSchema);
