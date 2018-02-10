const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
  parentId: { type: Number, required: true, default: 0 },
  id: { type: Number, required: true },
  name: { type: String, required: true },
  label: { type: String, required: true  }
});

module.exports = mongoose.model('Auth', AuthSchema);
