module.exports = {
  isLoggedIn: (req, res, next) => {
    if (!req.user) {
      res.sendStatus(400).redirect("/api/login");
    }
    next();
  },
};
