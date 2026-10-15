const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    accountNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['checking', 'savings'], default: 'checking' },
    balance: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
