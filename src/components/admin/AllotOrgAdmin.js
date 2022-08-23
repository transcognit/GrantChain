import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { Table, Divider } from "antd";
import "antd/dist/antd.css";

const axios = require("axios").default;

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
    title: "SL No.",
    dataIndex: "no",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Email ID",
    dataIndex: "emailid",
  },
];

export default function AllotOrgAdmin(props) {
  const [usermails, setusermaeil] = useState("");
  const [compaignList, setCompaignList] = useState([]);
  const [compaignnID, setcompaignnID] = useState([]);

  useEffect(() => {
    getUserDetails();
    getCampaignDetails();
  }, []);

  const [taskCompletion, settaskCompletion] = useState();
  const [taskDetails, settaskDetails] = useState([]);
  // const [sliderValue, setslidervalue] = useState();

  const getCampaignDetails = async () => {
    let campaignList = [];
    let campaginData = await axios.get("http://127.0.0.1:3001/getCampagins");

    campaginData.data.map((value, key) => {
      let newcampaignList = {
        key: key,
        idCapaign: value.campaginid,
        nameCapaign: value.campaginname,
        startDate: value.startdata,
        endDate: value.enddate,
        details: value.details,
      };
      campaignList.push(newcampaignList);
    });
    // console.log("=======================>hai", campaignList);
    setCompaignList(campaignList);
  };

  const getUserDetails = async () => {
    let userData = await axios.get("http://127.0.0.1:3001/getorgAdmins");

    console.log("AllotOrgAdmin: ", props.userName);

    let taskDetailsList = [];

    userData.data.map((value, key) => {
      let newTask = {
        key: key,
        no: key,
        emailid: value.emailid,
      };
      taskDetailsList.push(newTask);
    });

    settaskDetails(taskDetailsList);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let campainID = selectedRows[0].idCapaign;
      console.log("table", selectedRows[0].idCapaign);
      setcompaignnID(campainID);
    },
  };

  const rowSelection1 = {
    onChange: (selectedRowKeys, selectedRows) => {
      let taskID = selectedRows[0].idTask;
      console.log("table", selectedRows[0].emailid);
      setusermaeil(selectedRows[0].emailid);
    },
  };

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

  const sliderChangeHanlde = (event) => {
    settaskCompletion(event.target.value);
    console.log(event.target.value);
  };

  const submitHandler = async () => {
    await axios.post("http://127.0.0.1:3001/allotAdmin", {
      emailid: usermails,
      campaginid: compaignnID,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Allot Campagin Admin
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
        <br />
        <br />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={submitHandler}
          className={classes.submit}
        >
          Allot
        </Button>
      </div>
    </Container>
  );
}
