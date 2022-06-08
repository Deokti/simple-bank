import { use, expect } from "chai";
import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import chaiArray from "chai-arrays";
import { BigNumber, BigNumberish, Contract } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
use(chaiAsPromised);
use(chaiArray);

// Convert currency unit from ether to wei
const _1Ether = parseEther("1");
const _2Ether = parseEther("2");
const _3Ether = parseEther("3");

describe("SimpleBank", function () {
  let owner: SignerWithAddress;
  let contract: Contract;

  beforeEach(async function () {
    const [acc1] = await ethers.getSigners();

    const SimpleBank = await ethers.getContractFactory("SimpleBank");
    const deploy = await SimpleBank.deploy();
    await deploy.deployed();

    owner = acc1;
    contract = deploy;
  });

  it("Should be correct address", async () => {
    expect(contract.address).to.be.properAddress;
  });

  it("Should return false if the user is not approved", async () => {
    const approv = await contract.approved(owner.address);
    expect(approv).to.be.false;
  });

  it("Should approve the investment of money", async () => {
    await contract.approve(owner.address);

    const approv = await contract.approved(owner.address);
    expect(approv).to.be.true;
  });

  it("Should return an error if the user is already approved", async () => {
    await contract.approve(owner.address);
    const error = contract.approve(owner.address);

    return expect(error).to.eventually.be.rejected.and.be.an.instanceOf(Error);
  });

  it("Should have to put one ethers on the account", async () => {
    await contract.approve(owner.address);

    await contract.deposit(_1Ether); // 1 Ether in 1000000000000000000 wei
    const deposit = await contract.balanceOf(owner.address);
    expect(deposit).to.be.eq(_1Ether);
  });

  it("Should deposit and withdraw ether from your account", async () => {
    await contract.approve(owner.address);
    let accountBalance: number;
    let balanceOf: BigNumber;

    // Send transaction on Contract. Inside call receive() external payable
    // Account balances 9999 - 3 ether => 9996 ether
    await sendTransaction(owner, contract.address, _3Ether.toHexString());

    balanceOf = await contract.balanceOf(owner.address);
    accountBalance = await getAccountBalance(owner);

    // Check the account balance at the address and the account balance
    expect(balanceOf).to.be.eq(_3Ether);
    expect(accountBalance).to.be.eq(9996);

    await contract.withdraw(_1Ether);

    balanceOf = await contract.balanceOf(owner.address);
    accountBalance = await getAccountBalance(owner);

    // Check the account balance at the address and the account balance
    expect(balanceOf).to.be.eq(_2Ether);
    expect(accountBalance).to.be.eq(9997);
  });
});

const sendTransaction = async (
  account: SignerWithAddress,
  to: string,
  value: BigNumberish,
) => {
  return account.sendTransaction({
    to,
    value,
  });
};

const getAccountBalance = async (
  account: SignerWithAddress,
): Promise<number> => {
  return parseInt(formatEther(await account.getBalance()));
};
