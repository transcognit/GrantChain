import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Select, MenuItem } from "@material-ui/core";

export default function AddTask(props) {
  const myContract = props.myContractObj;
  const ethereum = window.ethereum;

  const [compaignList, setCompaignList] = useState([]);

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },

    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },

    input: {
      margin: theme.spacing(1, 0, 1),
    },

    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    getCampaignList();
  }, []);

  const getCampaignList = async () => {
    let campaignCount = await myContract.methods.campaignCount().call();

    let campaignList = [];

    for (let i = 0; i < campaignCount; i++) {
      let campaigndatas = await myContract.methods.campaignDetails(i).call();
      let newcampaignList = [i, campaigndatas.name];
      campaignList.push(newcampaignList);
    }
    console.log("=======================>hai", campaignList);
    setCompaignList(campaignList);
  };

  const [idofcampaign, setidofcampaign] = useState();
  const [taskName, setTaskName] = useState();
  const [taskLocation, setTaskLocation] = useState();
  const [taskDetails, setTaskDetails] = useState();
  const [benificeirs, setBenificeirs] = useState();
  const [requiredAmount, setRequiredAmount] = useState();

  const submitHandler = async (event) => {
    event.preventDefault();
    // console.log(taskName, idofcampaign, taskLocation, taskDetails, benificeirs, requiredAmount);
    let campaignName = await myContract.methods.campaignDetails(idofcampaign).call();
    console.log(campaignName.name)
    const infoValue = await myContract.methods
      .newTask(taskName, idofcampaign, campaignName.name, taskLocation, taskDetails, benificeirs, requiredAmount)
      .send({ from: props.payAddress, gas: 999999 });
    console.log(infoValue);
  };

  const compaignChangeHandler = (event) => {
    setidofcampaign(event.target.value);
  };

  const taskNameChangeHandler = (event) => {
    setTaskName(event.target.value);
  };

  const taskLocationChangeHandler = (event) => {
    setTaskLocation(event.target.value);
  };

  const taskDetailsChangeHandler = (event) => {
    setTaskDetails(event.target.value);
  };

  const benificeirsChangeHandler = (event) => {
    setBenificeirs(event.target.value);
  };

  const requiredAmountChangeHandler = (event) => {
    setRequiredAmount(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create Task
        </Typography>
        <form noValidate onSubmit={submitHandler}>
          <Select
            labelId="nameofcampaign"
            id="nameofcampaign"
            value={idofcampaign  ?? "Select"}
            required
            fullWidth
            variant="outlined"
            onChange={compaignChangeHandler}
            className={classes.input}
          >
            {compaignList.map((data) => (<MenuItem key={data[0]} value={data[0]}>{data[1]}</MenuItem>))}
          </Select>

          <TextField
            autoComplete="taskname"
            name="taskname"
            variant="outlined"
            required
            fullWidth
            id="taskname"
            label="Task Name"
            autoFocus
            onChange={taskNameChangeHandler}
            className={classes.input}
          />

          <TextField
            autoComplete="tasklocation"
            name="tasklocation"
            variant="outlined"
            required
            fullWidth
            id="tasklocation"
            label="Task Location"
            autoFocus
            onChange={taskLocationChangeHandler}
            className={classes.input}
          />

          <TextField
            autoComplete="taskdetails"
            name="taskdetails"
            variant="outlined"
            required
            fullWidth
            id="taskdetails"
            label="Task Details"
            autoFocus
            onChange={taskDetailsChangeHandler}
            className={classes.input}
          />

          <TextField
            autoComplete="taskbenificiary"
            name="taskbenificiary"
            variant="outlined"
            required
            fullWidth
            id="taskbenificiary"
            label="Task Beneficiaries"
            autoFocus
            onChange={benificeirsChangeHandler}
            className={classes.input}
          />

          <TextField
            autoComplete="amount"
            name="amount"
            variant="outlined"
            required
            fullWidth
            id="amount"
            label="Required Amount"
            autoFocus
            onChange={requiredAmountChangeHandler}
            className={classes.input}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create Task
          </Button>
        </form>
      </div>
    </Container>
  );
}
