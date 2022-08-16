Web3 = require("web3");
var path = require("path");

const loopLimit = 10;

const web3 = new Web3("http://localhost:8545");

var MyContractJSON = require(path.join(
  __dirname,
  "build/contracts/CarbonCredit.json"
));

accountAddress = "0xae3a03b4222D652aACe11d7620eab566597f745b";
const contractAddress = MyContractJSON.networks["5777"].address;

const contractAbi = MyContractJSON.abi;

const myContract = new web3.eth.Contract(contractAbi, contractAddress);

info();

// uncomment to run the sim
// signUpSim();
// carAssemblySim();

async function info() {
  console.log("Contract Addres:", contractAddress);
  console.log("Account Balance: ", await web3.eth.getBalance(accountAddress));
}

async function signUpSim() {
  console.time("User Signup Simulation Time Taken: ");
  for (var i = 0; i < loopLimit; i++) {
    let supplierDID = await web3.eth.accounts.create().address;
    let oemDID = await web3.eth.accounts.create().address;

    const txData1 = await myContract.methods
      .newUser(supplierDID, "supplier", "test site", "Supplier")
      .send({ from: accountAddress, gasLimit: "927000" });
    console.log("Supplier Added. Tx:", txData1.transactionHash);

    const txData2 = await myContract.methods
      .newUser(oemDID, "supplier", "test site", "OEM")
      .send({ from: accountAddress, gasLimit: "927000" });
    console.log("OEM Added. Tx:", txData2.transactionHash);
  }
  console.timeEnd("User Signup Simulation Time Taken: ");
}

async function carAssemblySim() {
  console.time("Car Assembly Simulation Time Taken: ");
  for (var i = 0; i < loopLimit; i++) {
    let comp1DID = await web3.eth.accounts.create().address;
    let comp2DID = await web3.eth.accounts.create().address;
    let carDID = await web3.eth.accounts.create().address;

    const txData1 = await myContract.methods
      .produceComponet(comp1DID, "Component " + i.toString(), 2, 50)
      .send({ from: accountAddress, gasLimit: "927000" });
    console.log("Component Added. Tx: ", txData1.transactionHash);

    const txData2 = await myContract.methods
      .produceComponet(comp2DID, "Component " + i.toString(), 2, 50)
      .send({ from: accountAddress, gasLimit: "927000" });
    console.log("Component Added. Tx: ", txData2.transactionHash);

    const txData3 = await myContract.methods
      .sendToOEM(accountAddress, comp1DID)
      .send({ from: accountAddress, gasLimit: "927000" });
    console.log("Component Transfered to OEM. Tx: ", txData3.transactionHash);

    const txData4 = await myContract.methods
      .sendToOEM(accountAddress, comp2DID)
      .send({ from: accountAddress, gasLimit: "927000" });
    console.log("Component Transfered to OEM. Tx: ", txData4.transactionHash);

    const txData5 = await myContract.methods
      .assembleCar(carDID, "BMW", 100, [comp1DID, comp2DID])
      .send({ from: accountAddress, gasLimit: "927000" });
    console.log("Car Assembled. Tx: ", txData5.transactionHash);
  }

  console.timeEnd("Car Assembly Simulation Time Taken: ");
}
