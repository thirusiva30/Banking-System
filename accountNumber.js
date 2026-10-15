const crypto = require('crypto');
const Account = require('../models/Account');

function randomAccountNumber() {
  // 12 digit account number, first digit never zero
  let number = String(crypto.randomInt(1, 10));
  for (let i = 0; i < 11; i++) number += String(crypto.randomInt(0, 10));
  return number;
}

async function generateUniqueAccountNumber() {
  let candidate;
  do {
    candidate = randomAccountNumber();
  } while (await Account.exists({ accountNumber: candidate }));
  return candidate;
}

module.exports = { generateUniqueAccountNumber };
