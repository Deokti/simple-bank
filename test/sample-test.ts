import { use, expect } from "chai";
import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import chaiArray from "chai-arrays";
import { Contract } from "ethers";
use(chaiAsPromised);
use(chaiArray);

describe("SimpleBank", function () {
  let accountAddress: string;
  let contract: Contract;

  beforeEach(async function () {
    const [acc1] = await ethers.getSigners();

    const SimpleBank = await ethers.getContractFactory("SimpleBank");
    const deploy = await SimpleBank.deploy();
    await deploy.deployed();

    accountAddress = acc1.address;
    contract = deploy;
  });

  it("Shold be correct address", async () => {
    expect(contract.address).to.be.properAddress;
  });
});
