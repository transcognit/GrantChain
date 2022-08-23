const mongoose = require("mongoose");

const CampaginSchema = new mongoose.Schema({
  campaginid: {
    type: String,
    required: true,
  },
  campaginname: {
    type: String,
    required: true,
  },
  startdata: {
    type: String,
    required: true,
  },
  enddate: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const CampaginModel = mongoose.model("campagin", CampaginSchema);
module.exports = CampaginModel;