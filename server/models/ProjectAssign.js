const mongoose = require("mongoose");

const BundilSchema = new mongoose.Schema({
  projectid: {
    type: String,
    required: true,
  },
  bundilID: {
    type: String,
    required: true,
  },
  useremaillist: {
    type: String,
    required: true,
  },
});

const BundilModel = mongoose.model("bundillist", BundilSchema);
module.exports = BundilModel;
