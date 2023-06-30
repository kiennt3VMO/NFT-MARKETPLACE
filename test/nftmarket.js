const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
function ethToWeh(wei) {
    const ethValue = wei * 1e18; // 1 Ether = 1e18 Wei
    return ethValue;
}
function weiToEther(wei) {
    const ethValue = wei / 1e18; // 1 Ether = 1e18 Wei
    return ethValue;
}
//tạo 1 nhóm các testcase
describe("NFTMarket", function () {
    let nftMarketContract;
    let nftContract;
    let owner;
    let buyer;
    let nftContractAddress;
    let marketContractAddress
    let provider;
    let adrOwner;



    //chạy 1 lần trước khi chạy testcase 
    before(async function () {
        //triển khai smartcontract
        const MARKET = await ethers.getContractFactory("NFTMarket");
        nftMarketContract = await MARKET.deploy();

        const NFT = await ethers.getContractFactory("NFT");
        nftContract = await NFT.deploy(nftMarketContract.getAddress());

        console.log("Active MARKET Contract");

        //Tạo địa chỉ ví 
        const [signer1, signer2] = await ethers.getSigners();
        owner = signer1;
        buyer = signer2;
    });

    // // TESTCASE CONNECT ADDRESS MARKET WITH NFT COLLECTION
    it("NFT Collection should be connect with MARKET address", async function () {
        nftContractAddress = await nftContract.getAddress();
        marketContractAddress = await nftMarketContract.getAddress();
        console.log(owner.address);
        console.log(buyer.address);

    });

    // //Listing Price
    let listingPrice;
    it("Should be return the listing price", async function () {
        // Arrange
        // Chuẩn bị dữ liệu cần thiết hoặc thiết lập môi trường
        let listing = ethToWeh(0.001);
        expect(listing).to.be.above(0)
        // Act
        // Thực thi các function trên smartcontract
        const result = await nftMarketContract.connect(owner).getListingPrice();

        // Assert
        // Kiểm tra kết quả và so sánh với kết quả mong đợi
        let parseListingPrice = Number(result);
        expect(parseListingPrice).to.equal(listing);
        listingPrice = parseListingPrice;
        console.log(parseListingPrice);

        // console.log(owner.address);
    });

    let tokenId = 1;
    let id;
    // createToken  createMarketItem
    it(`Should be create and listing NFT on Market `, async function () {

        let metadataURI = "ipfs://QmdnSBLxPTGKRGzwnFuXieVseP77jKfSX4k5w6etjixpYB";
        expect(metadataURI).to.not.be.empty;

        
        const transaction = await nftContract.connect(owner).createToken(metadataURI);
        const receipt = await transaction.wait();
        // Get the Transfer event
        const transferEvent = receipt.logs
            .map((log) => nftContract.interface.parseLog(log))
            .find((parsedLog) => parsedLog.name === "Transfer");

        // Extract the newItemId from the event
        const newItemId = transferEvent.args[2];
        // Using Number constructor
        const parsedValue = Number(newItemId);
        id = parsedValue;
        expect(parsedValue).to.equal(tokenId);
        // console.log(id);

        //Chuẩn bị dữ liệu
        let price = ethToWeh(0.05);
        let listPrice = ethToWeh(0.001);


        expect(price).to.be.above(0)
        expect(listPrice).to.equal(listingPrice);

        //buyer bán item
        const transaction1 = await nftMarketContract.connect(owner).createMarketItem(
            nftContractAddress,
            id,
            price.toString(),
            {
                value: listingPrice
            }
        );
        const receipt1 = await transaction1.wait();
        // console.log(receipt.to);

        tokenId+=1;
    });

    // //createMarketSale
    it(`Should be buy NFT from Market `, async function () {

        let priceNft = ethToWeh(0.05);
        let price = ethToWeh(0.05);
        let listPrice = ethToWeh(0.001);

        expect(price).to.be.equal(priceNft)
        expect(listPrice).to.equal(listingPrice);

        const transaction = await nftMarketContract.connect(owner).createMarketSale(
            nftContractAddress,
            id,
            {
                value: priceNft.toString()
            }
        );
        const receipt = await transaction.wait();
        // console.log(receipt.to);
        // console.log(receipt.from);


    });

    // //reSellToken
    it(`Should be repurchase NFT to Market after buy `, async function () {

        let price = ethToWeh(0.05);
        let listPrice = ethToWeh(0.001);

        expect(listPrice).to.equal(listingPrice);
        expect(price).to.be.above(0);
        const transaction = await nftMarketContract.connect(owner).reSellToken(
            nftContractAddress,
            id,
            price.toString(),
            {
                value: listPrice.toString()
            }
        );
        const receipt = await transaction.wait();
        console.log(receipt.to);
        console.log(receipt.from);
    });

    //cancelSellToken
    it(`Should be cancel purchase NFT to Market after buy `, async function () {

        let priceNft = ethToWeh(0.05);
        let price = ethToWeh(0.05);
        let listPrice = ethToWeh(0.001);

        expect(price).to.be.equal(priceNft)
        expect(listPrice).to.equal(listingPrice);
        const transaction = await nftMarketContract.connect(owner).cancelSaleToken(
            nftContractAddress,
            id,
            {
                value: price.toString()
            }
        );
        const receipt = await transaction.wait();
        console.log(receipt.to);
        console.log(receipt.from);
    });

    // //Fetch item transaction
    it(`Should be fetch item `, async function () {
        let metadataURI = "ipfs://QmdnSBLxPTGKRGzwnFuXieVseP77jKfSX4k5w6etjixpYB";
        expect(metadataURI).to.not.be.empty;

        
        const transaction = await nftContract.connect(owner).createToken(metadataURI);
        const receipt = await transaction.wait();
        // Get the Transfer event
        const transferEvent = receipt.logs
            .map((log) => nftContract.interface.parseLog(log))
            .find((parsedLog) => parsedLog.name === "Transfer");

        // Extract the newItemId from the event
        const newItemId = transferEvent.args[2];
        // Using Number constructor
        const parsedValue = Number(newItemId);
        id = parsedValue;
        expect(parsedValue).to.equal(tokenId);
        // console.log(id);

        //Chuẩn bị dữ liệu
        let price = ethToWeh(0.05);
        let listPrice = ethToWeh(0.001);

        expect(price).to.be.above(0)
        expect(listPrice).to.equal(listingPrice);

        //buyer bán item
        const transaction1 = await nftMarketContract.connect(owner).createMarketItem(
            nftContractAddress,
            id,
            price.toString(),
            {
                value: listingPrice
            }
        );
        const receipt1 = await transaction1.wait();


        // const transaction = await nftMarketContract.connect(owner).fetchMarketItem();
        const marketItems = await nftMarketContract.connect(owner).fetchMarketItem();

        // Perform assertions on the returned data
        expect(marketItems).to.be.an("array");
        expect(marketItems.length).to.be.above(0);
        console.log(marketItems);

        const marketItems1 = await nftMarketContract.fetchAllTransaction();
        // Perform assertions on the returned data
        expect(marketItems1).to.be.an("array");
        expect(marketItems1.length).to.be.above(0);
        console.log(marketItems1);

        const marketItems2 = await nftMarketContract.fetchItemsCreated();

        // Perform assertions on the returned data
        expect(marketItems2).to.be.an("array");
        expect(marketItems2.length).to.be.above(0);
        console.log(marketItems2);
    
        const marketItems3 = await nftMarketContract.fetchMyNFT();

        // Perform assertions on the returned data
        expect(marketItems3).to.be.an("array");
        expect(marketItems3.length).to.be.above(0);
        console.log(marketItems3);
    });



});
