const {
  getSelectors,
  FacetCutAction,
  removeSelectors,
  findAddressPositionInFacets,
} = require("../scripts/libraries/diamond.js");
import { deployDiamond } from "../scripts/deploy.diamond";

// import { use, expect } from "chai";
import { expect, assert, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiArray from "chai-arrays";
import { ethers } from "hardhat";
import { BigNumber, BigNumberish, Contract } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

use(chaiAsPromised);
use(chaiArray);

describe("Diamond Simple Bank", function () {
  let diamondAddress: string;
  let diamondCutFacet: any;
  let diamondLoupeFacet: any;
  let ownershipFacet: any;
  let owner: SignerWithAddress;

  let BankModify: Contract;
  let BankView: Contract;

  let tx;
  let receipt;
  let result;
  const addresses: string[] = [];

  before(async function () {
    const [_, acc2] = await ethers.getSigners();

    diamondAddress = await deployDiamond();
    diamondCutFacet = await ethers.getContractAt(
      "DiamondCutFacet",
      diamondAddress,
    );
    diamondLoupeFacet = await ethers.getContractAt(
      "DiamondLoupeFacet",
      diamondAddress,
    );
    ownershipFacet = await ethers.getContractAt(
      "OwnershipFacet",
      diamondAddress,
    );
    owner = acc2;
  });

  it("should have three facets -- call to facetAddresses function", async () => {
    for (const address of await diamondLoupeFacet.facetAddresses()) {
      addresses.push(address);
    }
    expect(addresses.length).equal(3);
  });

  it("facets should have the right function selectors -- call to facetFunctionSelectors function", async () => {
    let selectors = getSelectors(diamondCutFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[0]);
    assert.sameMembers(result, selectors);
    selectors = getSelectors(diamondLoupeFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[1]);
    assert.sameMembers(result, selectors);
    selectors = getSelectors(ownershipFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[2]);
    assert.sameMembers(result, selectors);
  });

  it("selectors should be associated to facets correctly -- multiple calls to facetAddress function", async () => {
    assert.equal(
      addresses[0],
      await diamondLoupeFacet.facetAddress("0x1f931c1c"),
    );
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress("0xcdffacc6"),
    );
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress("0x01ffc9a7"),
    );
    assert.equal(
      addresses[2],
      await diamondLoupeFacet.facetAddress("0xf2fde38b"),
    );
  });

  it("should add SimpleBankModifyFacet functions", async () => {
    const BankModify2 = await ethers.getContractFactory(
      "SimpleBankModifyFacet",
    );
    const bankModify = await BankModify2.deploy();
    await bankModify.deployed();
    addresses.push(bankModify.address);
    const selectors = getSelectors(bankModify).remove([
      "supportsInterface(bytes4)",
    ]);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: bankModify.address,
          action: FacetCutAction.Add,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      "0x",
      { gasLimit: 800000 },
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(bankModify.address);
    assert.sameMembers(result, selectors);
  });

  it("should add SimpleBankViewFacet functions", async () => {
    const Test2Facet = await ethers.getContractFactory("SimpleBankViewFacet");
    const test2Facet = await Test2Facet.deploy();
    await test2Facet.deployed();
    addresses.push(test2Facet.address);
    const selectors = getSelectors(test2Facet);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: test2Facet.address,
          action: FacetCutAction.Add,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      "0x",
      { gasLimit: 800000 },
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(test2Facet.address);
    assert.sameMembers(result, selectors);
  });

  it("should test function call", async () => {
    const [acc1] = await ethers.getSigners();
    const bankModify = await ethers.getContractAt(
      "SimpleBankModifyFacet",
      diamondAddress,
    );
    const bankView = await ethers.getContractAt(
      "SimpleBankViewFacet",
      diamondAddress,
    );
    await bankModify.approve(acc1.address);
    const approved = await bankView.approved(acc1.address);
    BankModify = bankModify;
    BankView = bankView;
    expect(approved).to.be.true;
  });

  it("Should have to put one ethers on the account", async () => {
    await BankModify.approve(diamondAddress);
    await BankModify.deposit(diamondAddress, _1Ether); // 1 Ether in 1000000000000000000 wei
    const deposit = await BankView.balanceOf(diamondAddress);
    expect(deposit).to.be.eq(_1Ether);
  });

  // it("Should deposit and withdraw ether from your account", async () => {
  //   const [_, acc2] = await ethers.getSigners();
  //   await BankModify.approve(acc2.address);
  //   let accountBalance: number;
  //   let balanceOf: BigNumber;

  //   // Send transaction on Contract. Inside call receive() external payable
  //   // Account balances 9999 - 3 ether => 9996 ether
  //   await sendTransaction(acc2, BankModify.address, _3Ether.toHexString());

  //   balanceOf = await BankView.balanceOf(acc2.address);
  //   accountBalance = await getAccountBalance(acc2);
  //   console.log({ balanceOf });

  //   // Check the account balance at the address and the account balance
  //   // expect(balanceOf).to.be.eq(_3Ether);
  //   // expect(accountBalance).to.be.eq(9996);

  //   // await BankModify.withdraw(acc2.address, _1Ether);

  //   // balanceOf = await BankView.balanceOf(acc2.address);
  //   // accountBalance = await getAccountBalance(acc2);

  //   // Check the account balance at the address and the account balance
  //   // expect(balanceOf).to.be.eq(_2Ether);
  //   // expect(accountBalance).to.be.eq(9997);
  // });
});

// Convert currency unit from ether to wei
const _1Ether = parseEther("1");
const _2Ether = parseEther("2");
const _3Ether = parseEther("3");

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
