const Model = require("../models/index");
const { Op } = require("sequelize");

exports.findUserByEmail = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.UserModel.findOne({
      where: {
        email: data.email,
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Find the User", error);
      });
  });
};

exports.findUserByNumber = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.UserModel.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Find the User", error);
      });
  });
};

exports.registration = (data) => {
  return new Promise((resolve, reject) => {
    Model.UserModel.create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Register the User");
      });
  });
};

exports.findUserByFacebookID = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    Model.UserModel.findOne({
      where: {
        facebookID: data.id,
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Find the User", error);
      });
  });
};

exports.findUserById = (data) => {
  return new Promise((resolve, reject) => {
    console.log(data);
    Model.UserModel.findOne({
      where: {
        id: data.id,
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("User Not Exits in Database", error);
      });
  });
};

exports.countAllUser = (data) => {
  return new Promise((resolve, reject) => {
    Model.UserModel.findAndCountAll({})
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to count the user");
      });
  });
};

exports.updateUser = (data) => {
  console.log(data); /* user ka data */
  return new Promise((resolve, reject) => {
    Model.UserModel.update(
      {
        gender: data.gender,
        age: data.age,
        address: data.address,
      },
      {
        where: {
          id: data.id,
        },
      }
    )
      .then((result) => {
        console.log("RESULT", result); /* 1 */
        resolve(result);
        return result;
      })
      .catch((error) => {
        console.log("Unable to Update User", error);
      });
  });
};

exports.updateUserInivite = (data) => {
  console.log(data); /* user ka data */
  return new Promise((resolve, reject) => {
    Model.UserModel.update(
      {
        inivitationStatus: data.inivitationStatus,
      },
      {
        where: {
          email: data.email,
        },
      }
    )
      .then((result) => {
        console.log("RESULT", result); /* 1 */
        resolve(result);
        return result;
      })
      .catch((error) => {
        console.log("Unable to Update User", error);
      });
  });
};

exports.AcceptInvite = (data) => {
  console.log(data); /* user ka data */
  return new Promise((resolve, reject) => {
    Model.UserModel.update(
      {
        inivitationStatus: data.inivitationStatus,
        senderEmail: data.senderEmail,
      },
      {
        where: {
          email: data.email,
        },
      }
    )
      .then((result) => {
        console.log("RESULT", result); /* 1 */
        resolve(result);
        return result;
      })
      .catch((error) => {
        console.log("Unable to Update User", error);
      });
  });
};

exports.changePassword = (data) => {
  return new Promise((resolve, reject) => {
    Model.UserModel.update(
      {
        password: data.password,
        // password: hash,
      },
      {
        where: {
          email: data.email,
          // email: email,
        },
      }
    )
      .then((result) => {
        console.log("RESULT", result); /* 1 */
        resolve(result);
        return result;
      })
      .catch((error) => {
        console.log("Unable to Update User", error);
      });
  });
};

exports.changePhonePassword = (data) => {
  return new Promise((resolve, reject) => {
    Model.UserModel.update(
      {
        password: data.password,
        // password: hash,
      },
      {
        where: {
          phoneNumber: data.phoneNumber,
          // email: email,
        },
      }
    )
      .then((result) => {
        console.log("RESULT", result); /* 1 */
        resolve(result);
        return result;
      })
      .catch((error) => {
        console.log("Unable to Update User", error);
      });
  });
};

// COUNT
exports.countuserByPhoneNumber = (data) => {
  return new Promise((resolve, reject) => {
    Model.UserModel.findAndCountAll({
      where: {
        phoneNumber: {
          [Op.ne]: 0,
        },
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to count the user");
      });
  });
};

exports.countuserByEmail = (data) => {
  return new Promise((resolve, reject) => {
    Model.UserModel.findAndCountAll({
      where: {
        [Op.and]: [
          {
            email: {
              [Op.like]: "%@%",
            },
            googleId: {
              [Op.eq]: 0,
            },
          },
        ],
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to show count of User");
      });
  });
};

exports.getUserBygoogleId = (data) => {
  return new Promise((resolve, reject) => {
    Model.UserModel.findAndCountAll({
      where: {
        googleId: {
          [Op.ne]: 0,
        },
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Show the Count of the Users");
      });
  });
};

exports.getUserByFacebookId = (data) => {
  return new Promise((resolve, reject) => {
    Model.UserModel.findAndCountAll({
      where: {
        facebookID: {
          [Op.ne]: 0,
        },
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("Unable to Show the Count of the Users");
      });
  });
};

// FIXME: NOTIFICATION

/* TODO: ASSOCATION */
Model.UserModel.hasMany(Model.NotificationModel, { foreignKey: "senderID" });
Model.NotificationModel.belongsTo(Model.UserModel, { foreignKey: "senderID" });

exports.addNotification = (data) => {
  return new Promise((resolve, reject) => {
    Model.NotificationModel.create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

// TODO:
exports.getNotification = (criteria) => {
  return new Promise((resolve, reject) => {
    Model.NotificationModel.findAndCountAll({
      include: [
        {
          model: Model.UserModel,
          attributes: [
            "id",
            "name",
            "email",
            "phoneNumber",
            "authenticationMethod",
          ],
        },
      ],
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("getAll err ==>>  ", err);
      });
  });
};
