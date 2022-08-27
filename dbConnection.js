const Sequelize = require("sequelize");
const env = require("./config/env")();

// Sequelize
const sequelize = new Sequelize(
  env.DATABASE.name,
  env.DATABASE.user,
  env.DATABASE.password,
  {
    host: env.DATABASE.host,
    dialect: "mysql",
  }
);

// Connection
var connectDB = () => {
  sequelize
    .authenticate()
    .then(() => {
      sequelize.sync({ alter: true });
      console.log("Connection and Synchronization Successfully!!");
    })
    .catch((error) => {
      console.error("Unable to connect the Database: " + error);
    });
};

module.exports = {
  connectDB: connectDB,
  sequelize: sequelize,
};
