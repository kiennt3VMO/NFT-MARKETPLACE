// const {
//   time,
//   loadFixture,
// } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
function ethToWeh(wei) {
  const ethValue = wei * 1e18; // 1 Ether = 1e18 Wei
  return ethValue;
}
describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
       const MARKET = await ethers.getContractFactory("NFTMarket");
        nftMarketContract = await MARKET.deploy();
        const marketAddress = await nftMarketContract.getAddress();
        console.log(marketAddress);

    // const NFT = await ethers.getContractFactory("NFT");
    // const nft = await NFT.deploy(marketAddress);
    // await nft.deploy(); //deploy the NFT contract

    // const nftAddress = await nft.getAddress();
    // console.log("2 " , nftAddress);

    // let listingPrice = await market.getListingPrice();
    // listingPrice = listingPrice.toString();
    // console.log("3 ", listingPrice);

    // const auctionPrice = ethToWeh(0.005);
    // console.log("4 ", auctionPrice.toString());

    // await nft.createToken("ipfs://QmdnSBLxPTGKRGzwnFuXieVseP77jKfSX4k5w6etjixpYB");
    // await nft.createToken("ipfs://QmdnSBLxPTGKRGzwnFuXieVseP77jKfSX4k5w6etjixpYB");

    // await market.createMarketItem(nftAddress, 1, auctionPrice,
    //   { value: listingPrice });
    // await market.createMarketItem(nftAddress, 2, auctionPrice,
    //   { value: listingPrice });

    // console.log("555 ", a.toString());

    // const [_, buyerAddress] = await ethers.getSigners();
    // console.log("6 ", buyerAddress.toString());

    // await market.connect(buyerAddress).createMarketSale(nftAddress, 1,
    //   { value: auctionPrice });
    //   await market.connect(buyerAddress).createMarketSale(nftAddress, 2,
    //     { value: auctionPrice });

    // const items = await market.fetchMarketItem();
    // const items1 = await Promise.all(items.map(async i => {
    //   const tokenUri = await nft.tokenURI(i.tokenId);

    //   return {
    //     price: i.price.toString(),
    //     tokenId: i.tokenId.toString(),
    //     seller: i.seller,
    //     owner: i.owner,
    //     tokenUri
    //   };
    // }));

    // console.log("7");

    // console.log("item ", items1);
    // console.log("items: ", items[0].itemId.toString());
    // console.log("items: ", items[1].itemId.toString());
    // console.log("8 ");

  })
});
