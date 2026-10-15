const router = require('express').Router();
const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const httpError = require('../utils/httpError');
const { generateUniqueAccountNumber } = require('../utils/accountNumber');

router.use(auth);

// List all accounts for the logged in user
router.get('/', async (req, res, next) => {
  try {
    const accounts = await Account.find({ user: req.userId }).sort({ createdAt: 1 });
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

// Open an additional account
router.post('/', async (req, res, next) => {
  try {
    const type = req.body.type === 'savings' ? 'savings' : 'checking';
    const account = await Account.create({
      user: req.userId,
      accountNumber: await generateUniqueAccountNumber(),
      type,
    });
    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
});

// Transaction history for one of the user's accounts
router.get('/:id/transactions', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) throw httpError(400, 'Invalid account id');

    const account = await Account.findOne({ _id: req.params.id, user: req.userId });
    if (!account) throw httpError(404, 'Account not found');

    const transactions = await Transaction.find({ account: account._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
