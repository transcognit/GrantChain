import { React, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Typography from "@material-ui/core/Typography";

import { Table, Divider } from "antd";
import "antd/dist/antd.css";
const axios = require("axios").default;
const columns = [
  {
    title: "SL No.",
    dataIndex: "slno",
  },
  {
    title: "Email ID",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "First Name",
    dataIndex: "firstname",
  },
  {
    title: "Last Name",
    dataIndex: "lastname",
  },
  {
    title: "Contribution",
    dataIndex: "contribution",
  },
  {
    title: "Alloted/Not",
    dataIndex: "alloted",
  },
];

export default function AdminDashBoard(props) {
  const myContract = props.myContractObj;

  const useStylesGrid = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  }));

  const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 275,
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    paper: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(0),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }));
  const classes = useStyles();
  const [donationDetails, setdonationDetails] = useState("");

  useEffect(() => {
    getDonationDetails();
  }, []);

  const getDonationDetails = async () => {
    let donationList = [];

    let donationData = await axios.get("http://127.0.0.1:3001/getDonations");
    console.log("hai", donationData.data);

    donationData.data.map((value, key) => {
      console.log("just value",value);
      let newdonationList = {
        key: key,
        slno: key,
        name: value.emailid,
        firstname: value.firstname,
        lastname: value.lastname,
        contribution: value.amount,
        alloted: value.alloted.toString(),
      };
      donationList.push(newdonationList);
    });

    setdonationDetails(donationList);
  };

  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [text4, setText4] = useState("");

  const [open1, setOpen1] = useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const cancel1 = () => {
    setOpen1(false);
  };

  const handleClose1 = async () => {
    const infoValue = await myContract.methods
      .withdrawEther(text1)
      .send({ from: props.payAddress, gas: 999999 });
    console.log(infoValue);
    setOpen1(false);
  };

  const [open2, setOpen2] = useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const cancel2 = () => {
    setOpen2(false);
  };

  const handleClose2 = async () => {
    const infoValue = await myContract.methods
      .depositeEther()
      .send({
        from: props.payAddress,
        gas: 999999,
        value: parseInt(text2) * 10 ** 18,
      });
    console.log(infoValue);
    setOpen2(false);
  };

  const [open3, setOpen3] = useState(false);

  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const cancel3 = () => {
    setOpen3(false);
  };

  const handleClose3 = async () => {
    const infoValue = await myContract.methods
      .issueCC(text3)
      .send({ from: props.payAddress, gas: 999999 });
    console.log(infoValue);
    setOpen3(false);
  };

  const [open4, setOpen4] = useState(false);

  const handleClickOpen4 = () => {
    setOpen4(true);
  };

  const cancel4 = () => {
    setOpen4(false);
  };

  const handleClose4 = async () => {
    const infoValue = await myContract.methods
      .depositeCC(text4)
      .send({ from: props.payAddress, gas: 999999 });
    console.log(infoValue);
    setOpen4(false);
  };

  const text1ChangeHandle = (event) => {
    setText1(event.target.value);
  };

  const text2ChangeHandle = (event) => {
    setText2(event.target.value);
  };

  const text3ChangeHandle = (event) => {
    setText3(event.target.value);
  };

  const text4ChangeHandle = (event) => {
    setText4(event.target.value);
  };

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h5">
        Notification Log
      </Typography>
      <div style={{ height: 400, width: 900 }}>
        <Divider />
        <Table columns={columns} dataSource={donationDetails} />
      </div>

      <Dialog
        open={open1}
        onClose={cancel1}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Withdraw from Contract</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount (ETH)"
            type="email"
            onChange={text1ChangeHandle}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel1} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose1} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open2}
        onClose={cancel2}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Contract Ether Balance</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount (ETH)"
            onChange={text2ChangeHandle}
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel2} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose2} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open3}
        onClose={cancel3}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Contract Carbon Credit Balance
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount"
            onChange={text3ChangeHandle}
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel3} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose3} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open4}
        onClose={cancel4}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Deposit Carbon Credit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount"
            onChange={text4ChangeHandle}
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel4} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose4} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
