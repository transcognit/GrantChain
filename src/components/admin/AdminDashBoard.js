import { React, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Typography from "@material-ui/core/Typography";

import { Table, Divider } from "antd";
import "antd/dist/antd.css";

const columns = [
  {
    title: "Event Action",
    dataIndex: "EventAction",
  },
  {
    title: "Timestamp",
    dataIndex: "DateTime",
  },
];

export default function AdminDashBoard(props) {
  const ethereum = window.ethereum;
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
  const classesGride = useStylesGrid();
  const [eventDetails, seteventDetails] = useState("");

  const [addressEtherBal, setaddressEtherBal] = useState("");
  const [contractEtherBal, setcontractEtherBal] = useState("");
  const [addressCCBal, setaddressCCBal] = useState("");
  const [contractCBal, setcontractCCBal] = useState("");

  useEffect(() => {
    getEventDetails();
  }, []);

  const getAdderssEtherBalance = async () => {
    let balanceInWei = await props.we3Obj.eth.getBalance(
      props.payAddress
    );
    let balanceInEther =
      (await props.we3Obj.utils.fromWei(balanceInWei, "ether")) + " ETH";
    setaddressEtherBal(balanceInEther);
  };

  const getContractEtherBalance = async () => {
    let balanceInWei = await props.we3Obj.eth.getBalance(props.contractAddress);
    let balanceInEther =
      (await props.we3Obj.utils.fromWei(balanceInWei, "ether")) + " ETH";
    setcontractEtherBal(balanceInEther);
  };

  const getAdderssCCBalance = async () => {
    let ccBalance = await myContract.methods
      .balanceOf(props.payAddress)
      .call();
    setaddressCCBal(ccBalance + " CC");
  };

  const getContractCCBalance = async () => {
    let ccBalance = await myContract.methods
      .balanceOf(props.contractAddress)
      .call();
    setcontractCCBal(ccBalance + " CC");
  };

  const getEventDetails = async () => {
    console.log("Web3: ", myContract);
    myContract.getPastEvents(
      "SystemLog",
      {
        fromBlock: 0,
        toBlock: "latest",
      },
      async(err, events) => {
        console.log("====>events", events);
        let eventDetails = [];

        for (let i = 0; i < events.length; i++) {
          let tokenValue = "Not Required";

          let blockData = await props.we3Obj.eth.getBlock(events[i].blockNumber);
          console.log(blockData);
          var blockTime = new Date(blockData.timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ')


          if (events[i].returnValues.TokenConsumption > "0") {
            tokenValue = events[i].returnValues.TokenConsumption;
          }

          let newEvent = {
            key: i,
            transactionHash: events[i].transactionHash,
            EventAction: events[i].returnValues.EventAction,
            EventTriggeredBy: events[i].returnValues.EventTriggeredBy,
            TokenConsumption: tokenValue,
            DateTime: blockTime,
          };
          eventDetails.push(newEvent);
        }
        seteventDetails(eventDetails);
      }
    );
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
  }

  const handleClose1 = async () => {
    const infoValue = await myContract.methods
      .withdrawEther(text1)
      .send({ from: props.payAddress, gas: 999999 });
    console.log(infoValue);
    getAdderssEtherBalance();
    getContractEtherBalance();
    setOpen1(false);
  };

  const [open2, setOpen2] = useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const cancel2 = () => {
    setOpen2(false);
  }

  const handleClose2 = async () => {
    const infoValue = await myContract.methods
      .depositeEther()
      .send({ from: props.payAddress, gas: 999999, value: parseInt(text2) * (10 ** 18) });
    console.log(infoValue);
    getContractEtherBalance();
    getAdderssEtherBalance();
    setOpen2(false);
  };

  const [open3, setOpen3] = useState(false);

  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const cancel3 = () => {
    setOpen3(false);
  }

  const handleClose3 = async () => {
    const infoValue = await myContract.methods
      .issueCC(text3)
      .send({ from: props.payAddress, gas: 999999 });
    console.log(infoValue);
    getAdderssCCBalance();
    setOpen3(false);
  };

  const [open4, setOpen4] = useState(false);

  const handleClickOpen4 = () => {
    setOpen4(true);
  };

  const cancel4 = () => {
    setOpen4(false);
  }

  const handleClose4 = async () => {
    const infoValue = await myContract.methods
      .depositeCC(text4)
      .send({ from: props.payAddress, gas: 999999 });
    console.log(infoValue);
    getContractCCBalance();
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
        <Table columns={columns} dataSource={eventDetails} />
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
