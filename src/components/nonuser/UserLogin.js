import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Container } from "@material-ui/core";

export default function UserLogin(props) {
  const [open, setOpen] = React.useState(false);

  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();

  const userNameChangeHandler = (event) => {
    setUserName(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

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
      width: "50%",
    },
  }));

  const classes = useStyles();
  const myContract = props.myContractObj;
  const ethereum = window.ethereum;

  const enableMetaMask = async () => {
    // await ethereum.request({ method: "eth_requestAccounts" });
    console.log(props.payAddress);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const userData = await myContract.methods
      .userDetails(userName)
      .call();
    console.log("User Type:", userData);
    if (
      userData.userType === "User" ||
      userData.userType === "Admin"
    ) {
      props.userLoginFun(userData.userType, userName);
    } else {
      setOpen(true);
      props.userLoginFun("home", userName);
    }

    setOpen(true);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form noValidate onSubmit={submitHandler}>
          <TextField
            autoComplete="username"
            name="username"
            variant="outlined"
            required
            fullWidth
            id="username"
            label="Enter Email ID"
            autoFocus
            onChange={userNameChangeHandler}
            className={classes.input}
          />

          <TextField
            variant="outlined"
            required
            fullWidth
            id="userpassword"
            label="Enter Password"
            name="userpassword"
            autoComplete="userpassword"
            onChange={passwordChangeHandler}
            className={classes.input}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={enableMetaMask}
            className={classes.submit}
          >
            Login
          </Button>
        </form>

        <div>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              Invalid User
            </Alert>
          </Snackbar>
        </div>
      </div>
    </Container>
  );
}
