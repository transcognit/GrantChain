const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./models/Users");
const ProjectModel = require("./models/Project");

const cors = require("cors");
const nodemailer = require("nodemailer");
const CampaginModel = require("./models/campagin");
const DonationModel = require("./models/Donations");

const Web3 = require("web3");
const CmapaignMangerModel = require("./models/CmapaignManger");

contractJson = require("./contractJson/GrantChain.json");

const web3 = new Web3("http://127.0.0.1:8545");
const contractAddress = contractJson.networks["5777"].address;
const contractAbi = contractJson.abi;

const myContract = new web3.eth.Contract(contractAbi, contractAddress);

const payAddress = "0x769d5A063175fa9559B3B190643a5C95A6cC403E";

const PORT_NO = 3001;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/grantchain");

// create campaign
app.post("/createCampagin", async (req, res) => {
  let campagin = req.body;
  let campaginCount = await myContract.methods.campaignCount().call();
  campagin.campaginid = campaginCount;
  const newCampagin = new CampaginModel(campagin);
  await newCampagin.save();
  await myContract.methods
    .plusCampaignCount()
    .send({ from: payAddress, gas: 999999 });
  res.send("Registred");
});

app.get("/getCampagins", (req, res) => {
  CampaginModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/findCampagin", async (req, res) => {
  let campagin = req.body;

  CampaginModel.find({ campaginid: campagin.campaginid }, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/findProject", async (req, res) => {
  let campagin = req.body;

  ProjectModel.find({ campaginid: campagin.campaginid }, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/getOrgCampagin", async (req, res) => {
  let data = req.body;

  let rdata = [];

  let campData = await CmapaignMangerModel.find({ emailid: data.userName });
  console.log(campData);
  for (let i = 0; i < campData.length; i++) {
    // console.log(campData[i].campaginid);
    let donationdata = await CampaginModel.find({
      campaginid: campData[i].campaginid,
    });
    rdata.push(donationdata);
    // console.log(donationdata);
  }
  res.send(rdata);
});

app.post("/getDonationData", async (req, res) => {
  let data = req.body;

  let rdata = [];

  let projectData = await ProjectModel.find({ projectid: data.projectid });
  // console.log(projectData);
  for (let i = 0; i < projectData[0].bundillist.length; i++) {
    // console.log(value);
    let donationdata = await DonationModel.find({
      donaitionid: projectData[0].bundillist[i],
    });
    rdata.push(donationdata);
    // console.log(donationdata);
  }

  // await projectData[0].bundillist
  //   .map(async (value, key) => {
  //     console.log(value);
  //     let donationdata = await DonationModel.find({ donaitionid: value });
  //     rdata.push(donationdata);
  //     console.log(donationdata);
  //   })
  // console.log("data", rdata);

  res.send(rdata);
});

app.post("/updateProject", async (req, res) => {
  let project = req.body;

  await ProjectModel.updateOne(
    { projectid: project.projectid },
    { $set: { completion: project.taskCompletion } }
  );

  let projectData = await ProjectModel.find({ projectid: project.projectid });

  // console.log(projectData[0].useremaillist);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false, // true for 465, false for other ports
    auth: {
      user: "grantchain3@gmail.com",
      pass: "xdkqkaqhyvxpeakk",
    },
  });

  let info = await transporter.sendMail({
    from: '"Grant Chain" grantchain3@gmail.com', // sender address
    to: projectData[0].useremaillist, // list of receivers
    subject: "Grantchain: Project progress", // Subject line
    text: `The project ${projectData[0].projectname} under the ${projectData[0].campaginname} campagin which you have donated to updated their progress to ${projectData[0].completion}`, // plain text body
    html: `The project <b>${projectData[0].projectname}</b> under the <b>${projectData[0].campaginname}</b> campagin which you have donated to updated their progress to <b>${projectData[0].completion}%</b>`, // html body
  });

  res.send("its done");
});

app.post("/addTask", async (req, res) => {
  let task = req.body;
  let donations = await DonationModel.find({ alloted: "false" });

  // console.log(donations);

  let donationIds = [];
  let donationUsers = [];
  let neededAmount = 0;

  donations.map(async (value, key) => {
    if (neededAmount <= parseInt(task.budget)) {
      neededAmount += parseInt(value.amount);
      if (!donationIds.includes(value.donaitionid)) {
        donationIds.push(value.donaitionid);
        await DonationModel.updateOne(
          { donaitionid: value.donaitionid },
          { $set: { alloted: "true" } }
        );
      }
      if (!donationUsers.includes(value.emailid)) {
        donationUsers.push(value.emailid);
      }
    }
  });
  // console.log(neededAmount);
  // console.log(donationIds);
  // console.log(donationUsers);
  task.allocated = neededAmount;
  task.useremaillist = donationUsers;
  task.bundillist = donationIds;
  campagindata = await CampaginModel.find({ campaginid: task.campaginid });
  // console.log(campagindata[0].campaginname);
  task.campaginname = campagindata[0].campaginname;

  let projectCount = await myContract.methods.projectCount().call();
  task.projectid = projectCount;
  const newProject = new ProjectModel(task);
  await newProject.save();
  await myContract.methods
    .createBundil(projectCount, donationIds.map(Number))
    .send({ from: payAddress, gas: 999999 });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false, // true for 465, false for other ports
    auth: {
      user: "grantchain3@gmail.com",
      pass: "xdkqkaqhyvxpeakk",
    },
  });

  let info = await transporter.sendMail({
    from: '"Grant Chain" grantchain3@gmail.com', // sender address
    to: donationUsers, // list of receivers
    subject: "Grantchain: Fund allocated", // Subject line
    text: `You donation has been allocated to the ${task.projectname} project under the ${task.campaginname} campagin`, // plain text body
    html: `You donation has been allocated to the <b>${task.projectname}</b> project under the <b>${task.campaginname}</b> campagin`, // html body
  });

  res.send("its done");
});

// create project under campaign
app.post("/createProject", async (req, res) => {
  const project = req.body;
  const newProject = new ProjectModel(project);
  await newProject.save();

  res.send("Registred");
});

// update project -- add pic

app.post("/createDonation", async (req, res) => {
  let donation = req.body;
  let donationCount = await myContract.methods.donationCount().call();
  donation.donaitionid = donationCount;
  const newDonation = new DonationModel(donation);
  await newDonation.save();
  await myContract.methods
    .newDonation(
      donation.emailid,
      donation.firstname,
      donation.lastname,
      donation.amount,
      donation.alloted
    )
    .send({ from: payAddress, gas: 999999 });

  res.json(donation);
});

app.post("/findDonation", async (req, res) => {
  let donation = req.body;

  DonationModel.find({ emailid: donation.emailid }, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.get("/findDonationAllocation", async (req, res) => {
  DonationModel.find({ alloted: "false" }, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.get("/getDonations", (req, res) => {
  DonationModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.get("/getorgAdmins", async (req, res) => {
  UserModel.find({ type: "OrgAdmin" }, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/allotAdmin", async (req, res) => {
  const data = req.body;
  const newAdmin = new CmapaignMangerModel(data);
  await newAdmin.save();

  res.json(data);
});

// add manager to campaign
app.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();

  res.json(user);
});

app.get("/getUsers", (req, res) => {
  UserModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/findUser", async (req, res) => {
  let user = req.body;

  UserModel.find({ emailid: user.emailid }, (err, result) => {
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

app.listen(PORT_NO, () => {
  console.log(`Server running on port ${PORT_NO}`);
});
