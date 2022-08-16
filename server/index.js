const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./models/Users");
const ProjectModel = require("./models/Project");

const cors = require("cors");
const CampaginModel = require("./models/campagin");

app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb://localhost:27017/grantchain"
);

// create campaign
app.post("/createCampagin", async (req, res) => {
  const campagin = req.body;
  const newCampagin = new CampaginModel(campagin);
  await newCampagin.save();

  res.send("Registred");
});

// create project under campaign

// update project -- add pic

// add manger to campaign

app.get("/getUsers", (req, res) => {
  UserModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();

  res.json(user);
});

app.listen(3001, () => {
  console.log("SERVER RUNS PERFECTLY!");
});
