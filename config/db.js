const mongoose = require("mongoose");
const colors = require("colors");
const config = require("./config");

const mongodbConnect = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URL);
    console.log(
      `mongo DB connected successfully. ${conn.connection.host}`.bgGreen
    );
  } catch (error) {
    console.log(`Error in connection of mongo: ${error}`.bgRed);
  }
};
module.exports = mongodbConnect;
