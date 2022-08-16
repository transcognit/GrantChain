import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Select, MenuItem } from "@material-ui/core";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

export default function UserSignup(props) {
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const [open, setOpen] = React.useState(false);

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

  const [fullName, setFullName] = useState("");
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  const [ethaddress, setethaddress] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();

    const infoValue = await myContract.methods
      .newUser(fullName, emailID, password, ethaddress)
      .send({ from: props.payAddress, gas: 999999 });
    console.log(infoValue);
    setOpen(true);
    setFullName("");
    setEmailID("");
    setPassword("");
    setethaddress("");
  };

  const fullNameChangeHandler = (event) => {
    setFullName(event.target.value);
  };

  const emailIDChangeHandler = (event) => {
    setEmailID(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const ethaddressChangeHandler = (event) => {
    setethaddress(event.target.value);
  };


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form noValidate onSubmit={submitHandler}>
          <TextField
            autoComplete="fullname"
            name="fullname"
            variant="outlined"
            required
            fullWidth
            id="fullname"
            label="Full Name"
            autoFocus
            onChange={fullNameChangeHandler}
            className={classes.input}
          />

          <TextField
            variant="outlined"
            required
            fullWidth
            id="emailid"
            label="Email-ID"
            name="emailid"
            autoComplete="emailid"
            onChange={emailIDChangeHandler}
            className={classes.input}
          />

          <TextField
            variant="outlined"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="password"
            onChange={passwordChangeHandler}
            className={classes.input}
          />

          <TextField
            variant="outlined"
            required
            fullWidth
            id="ethaddress"
            label="Wallet Address"
            name="ethaddress"
            autoComplete="ethaddress"
            onChange={ethaddressChangeHandler}
            className={classes.input}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Registration Successfull
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}
