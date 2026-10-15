module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? 'Something went wrong' : err.message,
  });
};
