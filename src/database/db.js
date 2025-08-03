const { dbName } = require("../constants/constant");
const moongoose = require("mongoose");
require("dotenv").config();

exports.DBconnection = async () => {
  try {
    const db = await moongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);
    console.log("Database Connection on hostId", db.connection.host);
  } catch (error) {
    console.log("Database Connection refused", error);
  }
};
