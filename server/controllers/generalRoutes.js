
// test route for after user has logged in
exports.route = function(req, res, next) {
  return res.status(200).json({
    authSuccess: true,
    user: req.user
  });
}
