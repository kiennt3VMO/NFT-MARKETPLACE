// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {
  
  const NFTMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();

  // await nftMarket.deployed();
  const marketAddress = await nftMarket.getAddress();
  console.log("NFTMarket deployed to:", marketAddress);

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketAddress);

  // await nft.deployed();
  const nftAddress = await nft.getAddress();
  console.log("NFT deployed to:",nftAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
