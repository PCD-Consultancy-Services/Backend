const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      config.mongoose.db_url,
      config.mongoose.clientOptions
    );
    await mongoose.connection.db.admin().command({ ping: 1 });

    mongoose.set("debug", true);
    logger.info(
      `Pinged your deployment. You successfully connected to Mongodb : ${conn.connection.host}`
    );
  } catch (error) {
    logger.error(`error===> ${error.message}`);
  }
  // finally {
  //   // Ensures that the client will close when you finish/error
  //   await mongoose.disconnect();
  // }
};

const modelNames = {
  User: "User",
  Role: "Role",
  Permission: "Permission",
  Classification: "Classification",
  Tank: "Tank",
  Chemical: "Chemical",
  Service: "Service",
  Customer: "Customer",
  Machine: "Machine",
  Quality: "Quality",
  MasterTemplate: "MasterTemplate",
  MasterTemplateColl: "master-templates",
  Shade: "Shade",
  Recipe: "Recipe",
  Schedule: "Schedule",
};

module.exports = {
  connectDB,
  modelNames,
};
