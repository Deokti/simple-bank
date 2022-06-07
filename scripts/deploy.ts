import { ethers } from "hardhat";

async function main() {
  const SampleContract = await ethers.getContractFactory("SampleContract");
  const connected = await SampleContract.deploy();

  await connected.deployed();

  console.log("SampleContract deployed to:", connected.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
