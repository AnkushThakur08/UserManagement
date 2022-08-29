// DOTENV
require("dotenv").config();

// Services
const Service = require("../Services");

// FOR PASSWORD
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

// OTP Generator
const otpGenerator = require("otp-generator");

// FOR NODEMAILER
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

// For Social Login
const passport = require("passport");
const { log } = require("console");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

var important_OTP;

module.exports = {
  registration: async (data) => {
    console.log(data);
    const userData = {
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
    };

    if (userData.email) {
      const user = await Service.userService.findUserByEmail(userData);
      if (user) {
        return {
          status: 400,
          message: "User already exists",
        };
      }
    } else if (userData.phoneNumber) {
      const user = await Service.userService.findUserByNumber(userData);
      if (user) {
        return {
          status: 400,
          message: "User already exists",
        };
      }
    } else if (userData.email || !userData.password) {
      return {
        status: 400,
        message: "Please Fill out All the Fields",
      };
    }

    try {
      const value = data.password;
      const salt = await bcrypt.genSalt(8);
      const hashPassword = await bcrypt.hash(value, salt);

      if (userData.email) {
        let userData = {
          name: data.name,
          email: data.email,
          password: hashPassword,
          phoneNumber: data.phoneNumber,
          authenticationMethod: 1,
        };
        const user = await Service.userService.registration(userData);

        return {
          status: 200,
          message: "User Registered Successfully",
          json: {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            authenticationMethod: user.authenticationMethod,
          },
        };
      } else {
        let userData = {
          name: data.name,
          email: data.email,
          password: hashPassword,
          phoneNumber: data.phoneNumber,
          authenticationMethod: 2,
        };
        const user = await Service.userService.registration(userData);

        return {
          status: 200,
          message: "User Registered Successfully",
          json: {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            authenticationMethod: user.authenticationMethod,
          },
        };
      }
    } catch (error) {
      return {
        status: 400,
        message: "Something went Wrong / Please enter Valid Details ",
      };
    }
  },

  registrationSendOTP: async (data) => {
    console.log(data);

    const userData = {
      phoneNumber: data.phoneNumber,
    };

    if (userData.phoneNumber) {
      const user = await Service.userService.findUserByNumber(userData);
      if (user) {
        return {
          status: 400,
          message: "User already exists",
        };
      } else {
        let userData = {
          name: data.name,
          phoneNumber: data.phoneNumber,
          authenticationMethod: 2,
        };
        const user = await Service.userService.registration(userData);

        // For Genreating Random OTP
        important_OTP = otpGenerator.generate(6, {
          digits: true,
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        console.log(important_OTP);

        // FOR Sending Message
        const twilio = require("twilio")(
          process.env.ACCOUNT_SID,
          process.env.AUTH_TOKEN
        );

        await twilio.messages
          .create({
            from: "+12342659887",
            to: `+${userData.phoneNumber}`,
            body: `Your One Time Password is ${important_OTP} This will expire in 5 mins`,
          })
          .then((message) => {
            // console.log("DATA is", message);
            return {
              status: 200,
              msg: "OTP Send Successfully",
              json: { message: message.body },
            };
          });

        return {
          status: 200,
          message:
            "OTP Send Successfully" /* User Registered  Successfully, for Front End we changed the message*/,
          json: {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            authenticationMethod: user.authenticationMethod,
          },
        };
      }
    } else {
      return {
        status: 400,
        message: "Fill out all the fields",
      };
    }
  },

  SendOTP: async (data) => {
    const userData = {
      phoneNumber: data.phoneNumber,
    };
    const user = await Service.userService.findUserByNumber(userData);
    if (user) {
      // For Genreating Random OTP
      important_OTP = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      console.log(important_OTP);

      // FOR Sending Message
      const twilio = require("twilio")(
        process.env.ACCOUNT_SID,
        process.env.AUTH_TOKEN
      );
      await twilio.messages
        .create({
          from: "+12342659887",
          to: `+${userData.phoneNumber}`,
          body: `Your One Time Password is ${important_OTP} This will expire in 5 mins`,
        })
        .then((data) => {
          console.log("DATA is", data);
          return {
            status: 200,
            message: "OTP Send Successfully",
            // data: data.body,
          };
        });

      return {
        status: 200,
        message: "OTP Send Successfully",
      }; /* .catch((err) => {
        console.log("Unable to Send The OTP", err);
      }); */
      // console.log("LAST", data);
    } else {
      return {
        status: 400,
        message: "User Does not Exists",
      };
    }
  },

  verifyOTP: async (data) => {
    const enteredOTP = {
      otp: data.OTP,
    };

    console.log("EnteredOTP", enteredOTP);
    console.log("important_OTP", important_OTP);
    if (enteredOTP.otp == important_OTP) {
      console.log(enteredOTP.otp);
      console.log(important_OTP);
      return {
        status: 200,
        message: "User Verified Successfully!!",
      };
    } else {
      return {
        status: 400,
        message: "OTP is Wrong!!",
      };
    }
  },

  verifyOTPLogin: async (data, req, res) => {
    const userData = {
      phoneNumber: data.phoneNumber,
    };

    const enteredOTP = {
      otp: data.OTP,
    };

    console.log("EnteredOTP", enteredOTP);
    console.log("important_OTP", important_OTP);
    if (enteredOTP.otp == important_OTP) {
      console.log(enteredOTP.otp);
      console.log(important_OTP);

      // Finding the user
      const user = await Service.userService.findUserByNumber(userData);
      if (user) {
        // Generate Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
        console.log(token);

        // Put Token in the cookies
        res.cookie("token", token, { expire: new Date() + 9999 });

        return {
          status: 200,
          message: "User loggedIn successfully",
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            googleId: user.googleId,
            facebookID: user.facebookID,
            authenticationMethod: user.authenticationMethod,
          },
        };
      } else {
        return {
          status: 400,
          message: "Unable to find the user",
        };
      }
    } else {
      return {
        status: 400,
        message: "OTP is Wrong!!",
      };
    }
  },

  registrationByFacebook: async (data, req, res) => {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    /* passport.deserializeUser(async function (id, done) {
      console.log("Line 217", id);
      const data = await Service.userService.findUserByFacebookID(id);
      console.log("Line no 219", data);
      if (data) {
        (err, user) => {
          done(err, user);
        };
      }l
    }) */

    passport.deserializeUser(function (id, done) {
      return done(null, id);
    });

    // Facebook Startegy
    passport.use(
      new FacebookStrategy(
        {
          // This will ask the token From Google
          clientID: process.env.FACEBOOK_CLIENTID,
          clientSecret: process.env.FACEBOOK_CLIENTSECRET,
          callbackURL:
            "http://localhost:8000/api/auth/facebook/callback" /* In this url google will attach the token and based on that token we will ask information  */,
        },
        async (token, refreshToken, profile, next) => {
          // Based on the token which google provided, we will ask Information
          console.log("PROFILE", profile);

          // TODO: SAVING User in the DB
          const userData = {
            id: profile.id,
          };

          console.log("ID is", userData);

          if (userData.id) {
            const user = await Service.userService.findUserByFacebookID(
              userData
            );

            if (user) {
              console.log("User alread exists in Database", user);
              next(null, user);
              return {
                status: 400,
                message: "User already exists in Database",
                data: user,
              };
            } else {
              let userData = {
                name: profile.displayName,
                facebookID: profile.id,
                authenticationMethod: 3,
              };

              console.log("STORED DATA", userData);

              const user = await Service.userService.registration(userData);
              next(null, user);
              return {
                status: 200,
                message: "User registration successfully",
              };
            }
          }
        }
      )
    );
  },

  registrationByGoogle: async (data, req, res) => {
    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });

    /* passport.deserializeUser(async function (id, done) {
      console.log("Line 217", id);
      const data = await Service.userService.findUserByFacebookID(id);
      console.log("Line no 219", data);
      if (data) {
        (err, user) => {
          done(err, user);
        };
      }l
    }) */

    passport.deserializeUser(function (id, done) {
      return done(null, id);
    });

    // Google Startegy
    passport.use(
      new GoogleStrategy(
        {
          // This will ask the token From Google
          clientID: process.env.GOOGLE_CLIENTID,
          clientSecret: process.env.GOOGLE_CLIENTSECRET,
          callbackURL:
            "http://localhost:8000/api/google/callback" /* In this url google will attach the token and based on that token we will ask information  */,
          // profileFields: ["id", "displayName", "email"],
        },
        async (token, refreshToken, profile, next) => {
          // Based on the token which google provided, we will ask Information
          console.log("PROFILE", profile);

          // TODO: SAVING User in the DB

          const userData = {
            email: profile._json.email,
          };

          if (userData.email) {
            const user = await Service.userService.findUserByEmail(userData);

            if (user) {
              console.log("User alread exists in Database", user);
              next(null, user);
              return {
                status: 400,
                message: "User already exists in Database",
                data: user,
              };
            } else {
              let userData = {
                name: profile.displayName,
                googleId: profile.id,
                email: profile._json.email,
                authenticationMethod: 4,
              };

              console.log(userData);

              const user = await Service.userService.registration(userData);
              next(null, user);
              return {
                status: 200,
                message: "User registration successfully",
              };
            }
          }
        }
      )
    );
  },

  countAllUser: async (data) => {
    const user = await Service.userService.countAllUser(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        messge: "NO User Found",
      };
    }
  },

  /* Need to Work */
  updateUser: async (data, req, res) => {
    const userData = {
      id: data.userId,
      gender: data.gender,
      age: data.age,
      address: data.address,
    };
    console.log("USER DATA :", userData); /* User ka data frontend se */
    const user = await Service.userService.findUserById(userData);
    if (user) {
      if (req.user.id === userData.id) {
        const users = await Service.userService.updateUser(userData);
        console.log("USER", user); /* 1 */
        return {
          status: 200,
          message: "User Update successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            age: user.Age,
            address: user.Address,
          },
        };
      } else {
        return {
          status: 200,
          message: "User is not Authenticated",
        };
      }
    } else {
      return {
        status: 400,
        json: "User Does Not Exists",
      };
    }
  },

  login: async (data, req, res) => {
    const userData = {
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
    };

    if (userData.email) {
      const user = await Service.userService.findUserByEmail(userData);
      if (user) {
        if (data.email && data.password) {
          const passwordMatch = await bcrypt.compare(
            data.password,
            user.password
          );

          if (user.email && passwordMatch) {
            // Generate Token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
            console.log(token);

            // Put Token in the cookies
            res.cookie("token", token, { expire: new Date() + 9999 });

            return {
              status: 200,
              message: "User loggedIn successfully",
              token: token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                googleId: user.googleId,
                facebookID: user.facebookID,
                authenticationMethod: user.authenticationMethod,
              },
            };
          } else {
            return {
              status: 400,
              message: "User name and Password Does Not match",
            };
          }
        } else {
          return {
            status: 400,
            message: "User Name and Password Does Not match",
          };
        }
      } else {
        return {
          status: 400,
          message: "User Does not exist",
        };
      }
    } else if (userData.phoneNumber) {
      const user = await Service.userService.findUserByNumber(userData);
      if (user) {
        if (data.phoneNumber && data.password) {
          const passwordMatch = await bcrypt.compare(
            data.password,
            user.password
          );

          if (user.phoneNumber && passwordMatch) {
            // Generate Token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
            console.log(token);

            // Put Token in the cookies
            res.cookie("token", token, { expire: new Date() + 9999 });

            /* TODO: NEED TO SEND MESSAGE (after phoneNumber and Message, need to verify) */

            return {
              status: 200,
              message: "User loggedIn successfully",
              token: token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                googleId: user.googleId,
                facebookID: user.facebookID,
                authenticationMethod: user.authenticationMethod,
              },
            };
          } else {
            return {
              status: 400,
              message: "User name and Password Does not Match",
            };
          }
        } else {
          // For Genreating Random OTP
          important_OTP = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });
          console.log(important_OTP);

          // FOR Sending Message
          const twilio = require("twilio")(
            process.env.ACCOUNT_SID,
            process.env.AUTH_TOKEN
          );
          await twilio.messages
            .create({
              from: "+12342659887",
              to: `+${userData.phoneNumber}`,
              body: `Your One Time Password is ${important_OTP} This will expire in 5 mins`,
            })
            .then((message) => {
              // console.log("DATA is", message);
              return {
                status: 200,
                msg: "OTP Send Successfully",
                json: { message: message.body },
              };
            })
            .catch((err) => {
              console.log("Unable to Send The OTP", err);
            });
        }
      } else {
        return {
          status: 400,
          message: "UserName Does not Exists in the Database",
        };
      }
    } else if (!userData.name && !userData.email && !userData.phoneNumber) {
      return {
        status: 400,
        message: "Please enter all the fields",
      };
    }
  },

  /* Sending Male to reset password*/
  sendResetPasswordMail: async (data, req, res) => {
    const userData = {
      email: data.email,
      phoneNumber: data.phoneNumber,
    };

    if (userData.email) {
      const user = await Service.userService.findUserByEmail(userData);
      if (user) {
        // Genreating Random String
        // let forgotToken = crypto.randomBytes(20).toString("hex");

        // Using Crypto For creating strong String
        // console.log(forgotToken);

        const secret = user.email + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ email: user.email }, secret, {
          expiresIn: "15m",
        });

        console.log(token);

        // SEND MAIL
        const transporter = nodemailer.createTransport(
          sgTransport({
            auth: {
              api_key: process.env.NODEMAILER_KEY,
            },
          })
        );

        transporter.sendMail({
          to: data.email,
          from: "tankush778@gmail.com",
          subject: "Password Reset Mail from Ankush",
          html: `<h3>This is your Password Reset Mail</h3>
          <h3> Click on the <a href="http://localhost:3000/reset/${token}">link </a> to reset your password</h3>
            `,
        });
        return {
          status: 200,
          message: "Email Sent Successfully",
        };
      } else {
        return {
          status: 400,
          message: "User Email Does Not Found in the Database",
        };
      }
    } else if (userData.phoneNumber) {
    }
  },

  /* Resetting the password using MAIL*/
  changePassword: async (data) => {
    const userData = {
      email: data.email,
      password: data.password,
      // token: data.token,
    };

    console.log(userData);

    const user = await Service.userService.findUserByEmail(userData);
    if (user) {
      const value = data.password;
      const salt = await bcrypt.genSalt(8);
      const hashPassword = await bcrypt.hash(value, salt);

      let userData = {
        email: data.email,
        password: hashPassword,
      };

      const user = await Service.userService.changePassword(userData);

      console.log(user);
      return {
        status: 200,
        message: "Password Update Successfully",
      };
    } else {
      return {
        status: 400,
        message: "User Does not Exists in the Database",
      };
    }
  },

  // Reset Password using Phone Number
  changePhonePassword: async (data) => {
    const enteredOTP = {
      otp: data.OTP,
    };
    const userData = {
      phoneNumber: data.phoneNumber,
      password: data.password,
    };

    console.log("EnteredOTP", enteredOTP);
    console.log("important_OTP", important_OTP);
    if (enteredOTP.otp == important_OTP) {
      console.log(enteredOTP.otp);
      console.log(important_OTP);

      // Finding the user
      const user = await Service.userService.findUserByNumber(userData);
      if (user) {
        const value = data.password;
        const salt = await bcrypt.genSalt(8);
        const hashPassword = await bcrypt.hash(value, salt);

        let userData = {
          phoneNumber: data.phoneNumber,
          password: hashPassword,
        };
        const user = await Service.userService.changePhonePassword(userData);

        console.log(user);
      } else {
        return {
          status: 400,
          message: "User Phone Number Not Exists",
        };
      }
      return {
        status: 200,
        message: "Password changed successfully",
      };
    } else {
      return {
        status: 400,
        message: "OTP is Wrong!!",
      };
    }
  },

  // INVITE MAIL
  SendInviteFriendMail: async (data, req, res) => {
    const userData = {
      email: data.email,
      name: data.name,
      senderName: data.senderName,
      senderid: data.senderid,
    };

    console.log("EMAIL", userData);

    if (userData.email) {
      const user = await Service.userService.findUserByEmail(userData);

      if (user) {
        // SEND MAIL
        const transporter = nodemailer.createTransport(
          sgTransport({
            auth: {
              api_key: process.env.NODEMAILER_KEY,
            },
          })
        );

        transporter.sendMail({
          to: data.email,
          from: "tankush778@gmail.com",
          subject: "Friend Invite Mail",
          html: `<h3>Your Friend has inivited you to join the Link </h3>
          <h3> Click on the <a href="http://localhost:3000/invite">link </a> to go to Invite Page</h3>
            `,
        });

        let userData = {
          name: data.name,
          email: data.email,
          inivitationStatus: "Pending",
        };

        const user = await Service.userService.updateUserInivite(userData);

        return {
          status: 200,
          message: "Email Sent Successfully",
        };
      } else {
        return {
          status: 400,
          message: "User Email Does Not Exists",
        };
      }
    } else if (userData.phoneNumber) {
    }
  },

  AcceptInvite: async (data) => {
    const userData = {
      email: data.email,
      senderEmail: data.senderEmail,
    };

    console.log(userData);

    const user = await Service.userService.findUserByEmail(userData);
    if (user) {
      let userData = {
        email: data.email,
        senderEmail: data.senderEmail,
        inivitationStatus: "Success",
      };

      const user = await Service.userService.AcceptInvite(userData);
      if (user) {
        console.log(user);
        return {
          status: 200,
          message: "invite Accepted Successfully",
        };
      } else {
        return {
          status: 400,
          messages: "Unable to accept the inivite",
        };
      }
    } else {
      return {
        status: 400,
        message: "Unable to Find the user in the database",
      };
    }
  },

  RejectInvite: async (data) => {
    const userData = {
      email: data.email,
      senderEmail: data.senderEmail,
    };

    console.log(userData);

    const user = await Service.userService.findUserByEmail(userData);
    if (user) {
      let userData = {
        email: data.email,
        senderEmail: data.senderEmail,
        inivitationStatus: "Failed",
      };

      const user = await Service.userService.AcceptInvite(userData);
      if (user) {
        console.log(user);
        return {
          status: 200,
          message: "invite Rejected Successfully",
        };
      } else {
        return {
          status: 400,
          messages: "Unable to Reject the inivite",
        };
      }
    } else {
      return {
        status: 400,
        message: "Unable to Find the user in the database",
      };
    }
  },

  countuserByPhoneNumber: async (data) => {
    const user = await Service.userService.countuserByPhoneNumber(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        messge: "NO DATA FOUND",
      };
    }
  },

  countuserByEmail: async (data) => {
    const user = await Service.userService.countuserByEmail(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "NO DATA FOUND",
      };
    }
  },

  getUserBygoogleId: async (data) => {
    const user = await Service.userService.getUserBygoogleId(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "NO DATA FOUND",
      };
    }
  },

  getUserByFacebookId: async (data) => {
    const user = await Service.userService.getUserByFacebookId(data);
    if (user) {
      return {
        status: 200,
        user: user,
      };
    } else {
      return {
        status: 400,
        message: "NO DATA FOUND",
      };
    }
  },

  // FIXME: NOTIFICATION

  addNotification: async (data, req, res) => {
    const userData = {
      content: data.content,
      senderID: data.senderID,
    };

    let findData = await Service.userService.addNotification(userData);
    if (findData) {
      return {
        status: 200,
        message: "Notification Send Successfully",
      };
    } else {
      return {
        status: 400,
        message: "Notification unable to send",
      };
    }
  },

  // TODO:

  getNotification: async (data) => {
    let notification = await Service.userService.getNotification();
    if (notification) {
      return {
        status: 200,
        message: "Notification Get Successfully",
        notification: notification,
      };
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
};
