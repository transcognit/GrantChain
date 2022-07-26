import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { Table, Divider } from "antd";
import "antd/dist/antd.css";
import { TextField } from "@material-ui/core";

const axios = require('axios').default

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

export default function TaskUpdate(props) {
  const [idTask, setidTask] = useState("");
  const [compaignList, setCompaignList] = useState([]);
  const [compaignnID, setcompaignnID] = useState([]);

  useEffect(() => {
    getCampaignDetails();
  }, []);

  const [taskCompletion, settaskCompletion] = useState();
  const [taskDetails, settaskDetails] = useState([]);
  // const [sliderValue, setslidervalue] = useState();

  const getCampaignDetails = async () => {
    let campaignList = [];

    let campaginData = await axios.get('http://127.0.0.1:3001/getCampagins')

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
    })
    // console.log("=======================>hai", campaignList);
    setCompaignList(campaignList);
  };

  const getTaskDetails = async (campainID) => {
    let projectData = await axios.post('http://127.0.0.1:3001/findProject', {
      campaginid: campainID,
    })

    console.log("Project Data: ", projectData)

    let taskDetailsList = [];

    projectData.data.map((value, key) => {
      let newTask = {
        key: key,
        idTask: value.projectid,
        taskName: value.projectname,
        taskLocation: value.location,
        taskRequirements: value.budget,
        taskAllocation: value.allocated,
        taskCompletion: value.completion,
      };
      taskDetailsList.push(newTask);
    })

    settaskDetails(taskDetailsList);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let campainID = selectedRows[0].idCapaign;
      console.log("table", selectedRows[0].idCapaign);
      setcompaignnID(campainID);
      getTaskDetails(campainID);
      
    },
  };

  const rowSelection1 = {
    onChange: (selectedRowKeys, selectedRows) => {
      let taskID = selectedRows[0].idTask;
      console.log("table", selectedRows[0].idTask);
      setidTask(taskID);
      settaskCompletion(parseInt(selectedRows[0].taskCompletion));
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

  const sliderChangeHanlde = (event) => {
    settaskCompletion(event.target.value);
    console.log(event.target.value)
  }

  const submitHandler = async() => {

    let projectData = await axios.post('http://127.0.0.1:3001/updateProject', {
      projectid: idTask,taskCompletion: taskCompletion,
    })
    getTaskDetails(compaignnID);
  }



  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Update Task Progress
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
        <Typography variant="h5" gutterBottom>
          Progress
        </Typography>
        <TextField
            autoComplete="taskname"
            name="taskname"
            variant="outlined"
            value={taskCompletion}
            required
            fullWidth
            id="taskname"
            label="Enter new progress"
            autoFocus
            onChange={sliderChangeHanlde}
            className={classes.input}
          />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={submitHandler}
          className={classes.submit}
        >
          Update Task
        </Button>
      </div>
    </Container>
  );
}
