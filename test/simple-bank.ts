import { use, expect } from "chai";
import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import chaiArray from "chai-arrays";
import { Contract } from "ethers";
import web3 from "web3";
import { parseEther } from "ethers/lib/utils";
use(chaiAsPromised);
use(chaiArray);

// Convert currency unit from ether to wei
const _1Ether = parseEther("1");
const _2Ether = parseEther("2");
const _3Ether = parseEther("3");

describe("SimpleBank", function () {
  let owner: string;
  let contract: Contract;

  beforeEach(async function () {
    const [acc1, acc2] = await ethers.getSigners();

    const SimpleBank = await ethers.getContractFactory("SimpleBank");
    const deploy = await SimpleBank.deploy();
    await deploy.deployed();

    owner = acc1.address;
    contract = deploy;
  });

  it("Should be correct address", async () => {
    expect(contract.address).to.be.properAddress;
  });

  it("Should return false if the user is not approved", async () => {
    const approv = await contract.approved(owner);
    expect(approv).to.be.false;
  });

  it("Should approve the investment of money", async () => {
    await contract.approve(owner);

    const approv = await contract.approved(owner);
    expect(approv).to.be.true;
  });

  it("Should return an error if the user is already approved", async () => {
    await contract.approve(owner);
    const error = contract.approve(owner);

    return expect(error).to.eventually.be.rejected.and.be.an.instanceOf(Error);
  });

  it("Should have to put one ethers on the account", async () => {
    await contract.approve(owner);

    await contract.deposit(owner, _1Ether); // 1 Ether in 1000000000000000000 wei
    const deposit = await contract.balanceOf(owner);
    expect(deposit).to.be.eq(_1Ether);
  });

  it("withdraw", async () => {
    await contract.approve(owner);

    await contract.deposit(owner, _3Ether); // 3 Ether in 3000000000000000000 wei

    console.log(await contract.balanceOf(owner));

    await contract.withdraw(_1Ether, { from: owner });

    console.log(await contract.balanceOf(owner));
  });
});
