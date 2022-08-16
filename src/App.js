import { useState } from "react";
import React from "react";
import "./App.css";
import AdminHomePage from "./components/admin/AdminHomePage";
import HomePage from "./components/nonuser/HomePage";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import Web3 from "web3";

import SupplierHomePage from "./components/doner/UserHomePage";

const App = () => {
  const [open, setOpen] = React.useState(false);

  const payAddress = "0x08fb17b57cE68c3E12b2e5D9709BEB8123FE5E5C";

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const [loginState, setLoginState] = useState("home");
  const [userName, setUserName] = useState();

  const ethereum = window.ethereum;

  const MyContractJSON = require("./contractjson/GrantChain.json");

  // console.log(RecontractAddress);

  const web3 = new Web3("http://127.0.0.1:8545");
  const contractAddress = MyContractJSON.networks["5777"].address;
  const contractAbi = MyContractJSON.abi;

  const myContract = new web3.eth.Contract(contractAbi, contractAddress);

  function userLogin(userRole, userName) {
    setLoginState(userRole);
    setUserName(userName);
    console.log(userName);
  }

  if (loginState === "home") {
    return (
      <div className="App">
        <HomePage myContractObj={myContract} setRoleFun={userLogin} payAddress={payAddress} />
        <div>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              Invalid User
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
  } else if (loginState === "User") {
    return (
      <div className="App">
        <SupplierHomePage myContractObj={myContract} we3Obj={web3} userName={userName} payAddress={payAddress} />
        <div>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              Invalid User
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
  } else if (loginState === "Admin") {
    return (
      <div className="App">
        <AdminHomePage myContractObj={myContract} we3Obj={web3} contractAddress={contractAddress} payAddress={payAddress} />
        <div>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              Invalid User
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
  }
};

export default App;
