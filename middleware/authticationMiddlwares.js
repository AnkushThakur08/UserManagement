// var { expressjwt: expressjwt } = require("express-jwt");

// For Protected Route
// exports.isSignedIn = expressjwt({
//   secret: process.env.JWT_SECRET_KEY,
//   algorithms: ["HS256"],
//   userProperty: "auth", //This auth contents id of the user (res.json(req.auth))
//   /* THIS WILL PUT THIS AUTH, inside every route */
// });

// // Middlewares
// exports.isAuthenticated = (req, res, next) => {
//   let checker = req.profile && req.auth && req.profile.id == req.auth.id;
//   if (!checker) {
//     return res.status(403).json({
//       error: "ACCESS DENIED",
//     });
//   }
//   next();
// };

// exports.isAdmin = (req, res, next) => {
//   // console.log(req);
//   console.log(req.profile);
//   if (req.profile.role == 0) {
//     return res.status(403).json({
//       error: "You are NOT ADMIN, ACCESS DENIED",
//     });
//   }*
//   next();
// };

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ error: "access rejected, You are not loged in...." });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(400).json({ error: " wrong token ..." });
  }
};
