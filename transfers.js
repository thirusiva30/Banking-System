const router = require('express').Router();
const crypto = require('crypto');
const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const httpError = require('../utils/httpError');
const { round2 } = require('../utils/money');

router.use(auth);

// Internal transfer between two accounts, run inside a MongoDB transaction
// so money is never debited without being credited.
router.post('/', async (req, res, next) => {
  const { fromAccountId, toAccountNumber, description = 'Transfer' } = req.body;
  const amount = round2(Number(req.body.amount));

  if (!Number.isFinite(amount) || amount <= 0) {
    return next(httpError(400, 'Enter a valid amount greater than zero'));
  }
  if (!mongoose.isValidObjectId(fromAccountId) || !toAccountNumber) {
    return next(httpError(400, 'Source account and recipient account number are required'));
  }

  const session = await mongoose.startSession();
  try {
    let result;

    await session.withTransaction(async () => {
      const from = await Account.findOne({ _id: fromAccountId, user: req.userId }).session(session);
      if (!from) throw httpError(404, 'Source account not found');

      const to = await Account.findOne({ accountNumber: String(toAccountNumber) }).session(session);
      if (!to) throw httpError(404, 'Recipient account not found');
      if (from._id.equals(to._id)) throw httpError(400, 'Cannot transfer to the same account');
      if (from.balance < amount) throw httpError(400, 'Insufficient funds');

      from.balance = round2(from.balance - amount);
      to.balance = round2(to.balance + amount);
      await from.save({ session });
      await to.save({ session });

      const reference = crypto.randomUUID();
      await Transaction.create(
        [
          {
            account: from._id,
            type: 'debit',
            amount,
            balanceAfter: from.balance,
            description,
            counterpartyAccount: to.accountNumber,
            reference,
          },
          {
            account: to._id,
            type: 'credit',
            amount,
            balanceAfter: to.balance,
            description,
            counterpartyAccount: from.accountNumber,
            reference,
          },
        ],
        { session }
      );

      result = { reference, amount, fromBalance: from.balance };
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  } finally {
    await session.endSession();
  }
});

module.exports = router;
