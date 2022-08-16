import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

export default function AddCompaign(props) {
  const myContract = props.myContractObj;
  const ethereum = window.ethereum;

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
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

  const [name, setName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [details, setDetails] = useState();

  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(props.payAddress);
    const infoValue = await myContract.methods
      .newCampaign(name, startDate, endDate, details)
      .send({ from: props.payAddress, gas: 999999 });
    console.log(infoValue);
  };

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  };

  const startDateChangeHandler = (event) => {
    setStartDate(event.target.value);
  };

  const endDateChangeHandler = (event) => {
    setEndDate(event.target.value);
  };

  const detailsChangeHandler = (event) => {
    setDetails(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create Campaign
        </Typography>
        <form noValidate onSubmit={submitHandler}>
          <TextField
            autoComplete="nameofcampaign"
            name="nameofcampaign"
            variant="outlined"
            required
            fullWidth
            id="nameofcampaign"
            label="Name of campaign"
            autoFocus
            onChange={nameChangeHandler}
            className={classes.input}
          />

          <TextField
            autoComplete="startdate"
            name="startdate"
            variant="outlined"
            type="date"
            required
            fullWidth
            id="startdate"
            InputLabelProps={{
              shrink: true,
            }}
            label="Start Date"
            autoFocus
            onChange={startDateChangeHandler}
            className={classes.input}
          />

          <TextField
            autoComplete="enddate"
            name="enddate"
            variant="outlined"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            required
            fullWidth
            id="enddate"
            label="End date"
            autoFocus
            onChange={endDateChangeHandler}
            className={classes.input}
          />

          <TextField
            autoComplete="details"
            name="details"
            variant="outlined"
            required
            fullWidth
            id="details"
            label="Details"
            autoFocus
            onChange={detailsChangeHandler}
            className={classes.input}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create Campaign
          </Button>
        </form>
      </div>
    </Container>
  );
}
