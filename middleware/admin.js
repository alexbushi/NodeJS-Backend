module.exports = (req, res, next) => {
  // req.user is set in previous middleware function auth
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');
  next();
};
