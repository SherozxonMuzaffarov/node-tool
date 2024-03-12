const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 250
  },
  phone_number: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  depo: {
    type: String,
    enum: ['O\'zvagonta\'mir', 'VCHD-3', 'VCHD-5', 'VCHD-6'],
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    required: true,
    default: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);