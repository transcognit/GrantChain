const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  emailid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
