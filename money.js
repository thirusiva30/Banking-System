// Round to two decimal places so balances never drift from floating point noise
const round2 = (n) => Math.round(n * 100) / 100;

module.exports = { round2 };
