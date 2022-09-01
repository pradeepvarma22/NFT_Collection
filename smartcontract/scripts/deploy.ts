import { ethers } from "hardhat";


async function main() {

  const metadata:string = process.env.METADATA_URL!
  const WhiteListcontractAddress:string = process.env.WHITELIST_CONTRACT_ADDRESS!
  const contractFact = await ethers.getContractFactory("CryptoDevs");
  const contract = await contractFact.deploy(metadata,WhiteListcontractAddress);

  await contract.deployed();

  console.log(contract.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
