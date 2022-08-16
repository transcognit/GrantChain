import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import QRCode from "qrcode.react";

import { Table, Divider } from "antd";
import "antd/dist/antd.css";

const columns = [
  {
    title: "Campaign ID",
    dataIndex: "idCapaign",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Name of campaign",
    dataIndex: "nameCapaign",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
  },
  {
    title: "End Date",
    dataIndex: "endDate",
  },
  {
    title: "Details",
    dataIndex: "details",
  },
];

const columnsT2 = [
  {
    title: "Task ID",
    dataIndex: "idTask",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Task Name",
    dataIndex: "taskName",
  },
  {
    title: "Task Loaction",
    dataIndex: "taskLocation",
  },
  {
    title: "Task Details",
    dataIndex: "taskDetails",
  },
  {
    title: "Requirement",
    dataIndex: "taskRequirements",
  },
  {
    title: "Allocation",
    dataIndex: "taskAllocation",
  },
  {
    title: "Task Completion",
    dataIndex: "taskCompletion",
  },
];

const columnsT3 = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Contribution",
    dataIndex: "contribution",
  }
];

export default function ViewDetails(props) {
  const [idTask, setidTask] = useState("");
  const [compaignList, setCompaignList] = useState([]);

  useEffect(() => {
    getCampaignDetails();
  }, []);

  const [taskCompletion, settaskCompletion] = useState();
  const [taskDetails, settaskDetails] = useState([]);
  const [componentDetails, setcomponentDetails] = useState([]);

  const [donationDetails, setdonationDetails] = useState([])

  const getDonationDetails = async () => {
    let donationCount = await myContract.methods.donationCount().call()

    let donationList = []

    for (let i = 0; i < donationCount; i++) {
      let donationdatas = await myContract.methods.donationDetails(i).call()
      console.log(donationdatas.username, props.username)
      // if (donationdatas.username == props.userName) {
        let newdonationList = {
          key: i,
          name: donationdatas.username,
          contribution: donationdatas.amount,
        }
        donationList.push(newdonationList)
      // }
    }
    console.log('=======================>hai', donationList)
    setdonationDetails(donationList)
  }

  const getCampaignDetails = async () => {
    let campaignCount = await myContract.methods.campaignCount().call();

    let campaignList = [];

    for (let i = 0; i < campaignCount; i++) {
      let campaigndatas = await myContract.methods.campaignDetails(i).call();
      let newcampaignList = {
        key: i,
        idCapaign: i,
        nameCapaign: campaigndatas.name,
        startDate: campaigndatas.startDate,
        endDate: campaigndatas.endDate,
        details: campaigndatas.details,
      };
      campaignList.push(newcampaignList);
    }
    console.log("=======================>hai", campaignList);
    setCompaignList(campaignList);
  };

  const getTaskDetails = async (campainID) => {
    let taskList = await myContract.methods
      .getTaskUnderCampaign(campainID)
      .call();
    // console.log("CarData: ", cardatas);
    // let componentList = cardatas[3];
    // console.log(componentList);
    let taskDetailsList = [];

    for (let i = 0; i < taskList.length; i++) {
      let taskdata = await myContract.methods.taskDetails(taskList[i]).call();
      console.log("+++++++++", taskdata);
      let newTask = {
        key: i,
        idTask: taskList[i],
        taskName: taskdata.taskName,
        taskLocation: taskdata.taskLocation,
        taskDetails: taskdata.taskDetails,
        taskRequirements: taskdata.requiredAmount,
        taskAllocation: taskdata.requiredAmount,
        taskCompletion: taskdata.progress,
      };
      taskDetailsList.push(newTask);
    }

    settaskDetails(taskDetailsList);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let campainID = selectedRows[0].idCapaign;
      console.log("table", selectedRows[0].idCapaign);
      getTaskDetails(campainID);
      // setcarDID(carid);
    },
  };

  const rowSelection1 = {
    onChange: (selectedRowKeys, selectedRows) => {
      let taskID = selectedRows[0].idTask;
      console.log("table", selectedRows[0].idTask);
      getDonationDetails();
    },
  };


  const myContract = props.myContractObj;
  const ethereum = window.ethereum;

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(0),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },

    input: {
      margin: theme.spacing(1, 0, 1),
    },

    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          View Details
        </Typography>

        <div style={{ width: 1000 }}>
          <Divider />

          <Table
            rowSelection={{
              type: "radio",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={compaignList}
          />
        </div>

        <div style={{ width: 1000 }}>
          <Divider />

          <Table
            rowSelection={{
              type: "radio",
              ...rowSelection1,
            }}
            columns={columnsT2}
            dataSource={taskDetails}
          />
        </div>

        <div style={{ width: 1000 }}>
          <Divider />

          <Table columns={columnsT3} dataSource={donationDetails} />
        </div>

      </div>
    </Container>
  );
}
