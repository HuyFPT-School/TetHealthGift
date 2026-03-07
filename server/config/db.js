const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://huylmnse181744_db_user:HvqaBt0DKPNwl2Ac@milkshop.zkxc7w1.mongodb.net/TetHealthGift?appName=TetHealthGift";

const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {}
};
module.exports = { connect };
