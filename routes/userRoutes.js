const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/userController");
const sendRespose = require("../helper/sendResponse");

const { isLoggedIn } = require("../middleware/socialAuthMiddleware");

const isAuth = require("../middleware/authticationMiddlwares");

// REGISTERATION & LOGIN
router.post("/registration", (req, res) => {
  // console.log(req);
  return sendRespose.executeMethod(
    userController.registration,
    req.body,
    req,
    res
  );
});

router.post("/registrationSendOTP", (req, res) => {
  return sendRespose.executeMethod(
    userController.registrationSendOTP,
    req.body,
    req,
    res
  );
});

router.post("/SendOTP", (req, res) => {
  return sendRespose.executeMethod(userController.SendOTP, req.body, req, res);
});

router.post("/verifyOTP", (req, res) => {
  return sendRespose.executeMethod(
    userController.verifyOTP,
    req.body,
    req,
    res
  );
});

router.post("/verifyOTPLogin", (req, res) => {
  return sendRespose.executeMethod(
    userController.verifyOTPLogin,
    req.body,
    req,
    res
  );
});

/* Need to Chnage */
router.put("/updateUser", isAuth, (req, res) => {
  return sendRespose.executeMethod(
    userController.updateUser,
    req.body,
    req,
    res
  );
});

router.post("/login", (req, res) => {
  return sendRespose.executeMethod(userController.login, req.body, req, res);
});

// DASHBOARD

router.get("/countAllUser", (req, res) => {
  return sendRespose.executeMethod(
    userController.countAllUser,
    req.body,
    req,
    res
  );
});

router.get("/countuserByPhoneNumber", (req, res) => {
  return sendRespose.executeMethod(
    userController.countuserByPhoneNumber,
    req.body,
    req,
    res
  );
});

router.get("/countuserByEmail", (req, res) => {
  return sendRespose.executeMethod(
    userController.countuserByEmail,
    req.body,
    req,
    res
  );
});

router.get("/getUserBygoogleId", (req, res) => {
  return sendRespose.executeMethod(
    userController.getUserBygoogleId,
    req.body,
    req,
    res
  );
});

router.get("/getUserByFacebookId", (req, res) => {
  return sendRespose.executeMethod(
    userController.getUserByFacebookId,
    req.body,
    req,
    res
  );
});

// Password RESET
router.post("/sendResetPasswordMail", (req, res) => {
  return sendRespose.executeMethod(
    userController.sendResetPasswordMail,
    req.body,
    req,
    res
  );
});

router.post("/changePassword", (req, res) => {
  return sendRespose.executeMethod(
    userController.changePassword,
    req.body,
    req,
    res
  );
});

router.post("/changePhonePassword", (req, res) => {
  return sendRespose.executeMethod(
    userController.changePhonePassword,
    req.body,
    req,
    res
  );
});

// INVITE FRIEND
router.post("/SendInviteFriendMail", (req, res) => {
  return sendRespose.executeMethod(
    userController.SendInviteFriendMail,
    req.body,
    req,
    res
  );
});

router.post("/AcceptInvite", (req, res) => {
  return sendRespose.executeMethod(
    userController.AcceptInvite,
    req.body,
    req,
    res
  );
});

router.post("/RejectInvite", (req, res) => {
  return sendRespose.executeMethod(
    userController.RejectInvite,
    req.body,
    req,
    res
  );
});


// FOR SOCIAL LOGIN - Facebook
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  }),
  (req, res) => {
    res.send("Hello Facebook");
  }
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    return sendRespose.executeMethod(
      userController.registrationByFacebook,
      req.body,
      req,
      res
    );
  }
);

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/login", (req, res) => {
  res.render("login");
});

// FOR SOCIAL LOGIN - Google

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("Hello Google!!");
  }
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  return sendRespose.executeMethod(
    userController.registrationByGoogle,
    req.body,
    req,
    res
  );
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("User logged out successfully!!");
  });
});

// LOGOUT
exports.signout1 = (req, res) => {
  res.clearCookie("token"); // Clear the cookier whose name is Token
  res.json({
    user: "User Signout Successfully",
  });
};

module.exports = router;
