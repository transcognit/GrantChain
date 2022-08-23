const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  projectid: {
    type: String,
    required: true,
  },
  projectname: {
    type: String,
    required: true,
  },
  campaginid: {
    type: String,
    required: true,
  },
  campaginname: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  allocated: {
    type: String,
    required: true,
  },
  completion: {
    type: String,
    required: true,
  },
  useremaillist: {
    type: [String],
    required: true,
  },
  bundillist: {
    type: [String],
    required: true,
  }
});

const ProjectModel = mongoose.model("project", ProjectSchema);
module.exports = ProjectModel;
