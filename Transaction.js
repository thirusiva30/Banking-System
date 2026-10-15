const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true, min: 0 },
    balanceAfter: { type: Number, required: true },
    description: { type: String, default: '', maxlength: 200 },
    counterpartyAccount: { type: String, default: '' },
    reference: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

transactionSchema.index({ account: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
