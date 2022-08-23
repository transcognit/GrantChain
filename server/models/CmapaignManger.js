const mongoose = require("mongoose");

const CmapaignMangerSchema = new mongoose.Schema({
  emailid: {
    type: String,
    required: true,
  },
  campaginid: {
    type: String,
    required: true,
  },
});

const CmapaignMangerModel = mongoose.model("cmapaigncanger", CmapaignMangerSchema);
module.exports = CmapaignMangerModel;
