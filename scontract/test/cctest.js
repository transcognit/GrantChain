const CarbonCredit = artifacts.require("CarbonCredit");
let instance = {};

const com1 = "0x6241e468E54d332D571952bBf30Fcd22365806f0";
const com2 = "0x03Ae9a72c8e1635D12ab00e64cffC38b2bE218F5";
const car1 = "0x701D3750e3cFBf36D9a84B0857F897d91116CE72";

contract("Carbon Credit App contract test", async (accounts) => {
  const mangerAddr = accounts[0];
  const supplierAddre = accounts[1];
  const oemAddr = accounts[2];
  let contractAddr = "";

  before("0. Deploying Contract and Signing Up user", async () => {
    instance = await CarbonCredit.deployed(10000000000000000000);
    contractAddr = instance.address;
    await instance.newUser(supplierAddre, "supplier", "test site", "Supplier");
    await instance.newUser(oemAddr, "supplier", "test site", "OEM");
  });

  it("1. The contract is deployed correctly", async () => {
    assert.isNotNull(instance);
    console.log("Deployed Address: ", instance.address);
  });

  it("2. Is able to deposite Ether to contract", async () => {
    await instance.depositeEther({
      from: mangerAddr,
      value: 100000000000000000,
    });
  });

  it("3. Is able to withdraw Ether from contract", async () => {
    await instance.depositeEther({
      from: accounts[0],
      value: 1000000000000000000,
    });
    await instance.withdrawEther(1);
  });

  it("4. Is able to issue new carbon credit", async () => {
    await instance.issueCC(1000000000000000);
  });

  it("5. Is able to deposite carbon credit to contract", async () => {
    await instance.depositeCC(1000000000000000);
  });

  it("6. Is able to buy carbon credit", async () => {
    await instance.getCC({ value: 1000000000000000000 });
  });

  it("7. Is able to return carbon credit for incentive", async () => {
    await instance.depositeEther({
      from: accounts[0],
      value: 5000000000000000000,
    });
    await instance.givebackCC(100);
  });

  it("8. Is able add & remove user(s)", async () => {
    await instance.newUser(accounts[4], "supplier", "test site", "Supplier");
    await instance.removeUser(accounts[4], { from: mangerAddr });
  });

  it("9. Is able add & remove manager(s)", async () => {
    await instance.addManger(accounts[4], { from: mangerAddr });
    await instance.removeManger(accounts[4], { from: mangerAddr });
  });

  it("10. Is able assign initial supply", async () => {
    await instance.initialSupply([oemAddr, supplierAddre], 2, 100000, {
      from: mangerAddr,
    });
  });

  it("11. Supplier is able to prouce new components", async () => {
    await instance.initialSupply([oemAddr, supplierAddre], 2, 100000, {
      from: mangerAddr,
    });
    await instance.produceComponet(com1, "Component A", 2, 100, {
      from: supplierAddre,
    });
    await instance.produceComponet(com2, "Component B", 2, 100, {
      from: supplierAddre,
    });
  });

  it("12. Supplier is able to send prouced components to OEM", async () => {
    await instance.initialSupply([oemAddr, supplierAddre], 2, 100000, {
      from: mangerAddr,
    });

    await instance.produceComponet(com1, "Component A", 2, 100, {
      from: supplierAddre,
    });
    await instance.produceComponet(com2, "Component B", 2, 100, {
      from: supplierAddre,
    });

    await instance.sendToOEM(oemAddr, com1);
    await instance.sendToOEM(oemAddr, com2);
  });

  it("13. OEM is able to assemble car using recived component", async () => {
    await instance.initialSupply([oemAddr, supplierAddre], 2, 100000, {
      from: mangerAddr,
    });

    await instance.produceComponet(com1, "Component A", 2, 100, {
      from: supplierAddre,
    });
    await instance.produceComponet(com2, "Component B", 2, 100, {
      from: supplierAddre,
    });

    await instance.sendToOEM(oemAddr, com1);
    await instance.sendToOEM(oemAddr, com2);

    await instance.assembleCar(car1, "BMW", 300, [com1, com2]);
  });
});
