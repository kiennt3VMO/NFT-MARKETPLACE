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
    let adrNft;



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

    // TESTCASE CONNECT ADDRESS MARKET WITH NFT COLLECTION
    it("NFT Collection should be connect with MARKET address", async function () {
        nftContractAddress = await nftContract.getAddress();
        marketContractAddress = await nftMarketContract.getAddress();
        console.log(owner.address);
        console.log(buyer.address);

    });

    // // //Listing Price
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

    let itemId;
    // createToken  createMarketItem
    it(`Should be create and listing NFT on Market `, async function () {
        // const buyerBalanceBefore = await ethers.provider.getBalance(owner.address);
        // console.log(buyerBalanceBefore);

        let metadataURI = "ipfs://QmdnSBLxPTGKRGzwnFuXieVseP77jKfSX4k5w6etjixpYB";
        describe('Condition to Create NFT', () => {
            it(`Metadata URI should not be empty`, async function () {
                expect(metadataURI).not.to.equal('');
            });
        });


        const transaction = await nftContract.connect(owner).createToken(metadataURI);
        const receipt = await transaction.wait();
        // Get the Transfer event
        const transferEvent = receipt.logs
            .map((log) => nftContract.interface.parseLog(log))
            .find((parsedLog) => parsedLog.name === "Transfer");
        // Extract the tokenId from the event
        const tokenId = transferEvent.args[2];
        // Using Number constructor
        const parsedValue = Number(tokenId);
        // console.log(parsedValue);
        itemId = parsedValue;

        //Chuẩn bị dữ liệu
        let price = ethToWeh(0.05);
        let listPrice = ethToWeh(0.001);
        describe('Condition to Listing NFT', () => {
            it(`Price when create item market have to bigger than 0`, async function () {
                expect(price).to.be.above(0)
            });
            it(`List price have to equal listing price of market`, async function () {
                expect(listPrice).to.equal(listingPrice);
            });
        });
        // //buyer bán item
        const result = await nftMarketContract.connect(owner).createMarketItem(
            nftContractAddress,
            itemId,
            price.toString(),
            {
                value: listingPrice
            }
        );
        describe('Run Function Create Market Item condition', async () => {
            it(`Function active`, async function () {
                expect(result).to.not.be.undefined;
            });
        });

        const receipt1 = await result.wait();
        // console.log(receipt1);
        adrNft = receipt1.to;
        // console.log(adrNft);

    });

    // //createMarketSale
    it(`Should be buy NFT from Market `, async function () {
        let priceNft = ethToWeh(0.05);
        let listPrice = ethToWeh(0.001);

        const result = await nftMarketContract.connect(owner).getItemId(itemId);
        console.log(result);
        describe('Condition to buy NFT', async () => {
            it(`Can't be Owner NFT `, async function () {
                expect(result[4]).not.to.equal(owner.address);
            });
            it(`Price when buy have to equal price of NFT`, async function () {
                expect(Number(result[5])).to.be.equal(priceNft)
            });
            it(`List price have to equal listing price of market`, async function () {
                expect(listPrice).to.equal(listingPrice);
            });

        });

        const transaction = await nftMarketContract.connect(owner).createMarketSale(
            nftContractAddress,
            itemId,
            {
                value: priceNft.toString()
            }
        );
        describe('Run Function Buy NFT condition', async () => {
            it(`Function active`, async function () {
                expect(transaction).to.not.be.undefined;
            });
        });

    });

    // // //reSellToken
    it(`Should be repurchase NFT to Market after buy `, async function () {

        let price = ethToWeh(0.05);
        let listPrice = ethToWeh(0.001);

        const result = await nftMarketContract.connect(owner).getItemId(itemId);
        console.log(result);
        // console.log(result); 
        // console.log(owner.address);
        describe('Condition to rePurchase NFT', async () => {
            it(`Have to be Owner NFT `, async function () {
                expect(result[4]).to.equal(owner.address);
            });
            it(`Price when rePurchase have to bigger then 0`, async function () {
                expect(price).to.be.above(0)
            });
            it(`List price have to equal listing price of market`, async function () {
                expect(listPrice).to.equal(listingPrice);
            });

        });

        const transaction = await nftMarketContract.connect(owner).reSellToken(
            nftContractAddress,
            itemId,
            price.toString(),
            {
                value: listPrice.toString()
            }
        );
        describe('Run Function rePurchase NFT condition', async () => {
            it(`Function active`, async function () {
                expect(transaction).to.not.be.undefined;
            });
        });
        // const receipt = await transaction.wait();
        // console.log(receipt.to);
        // console.log(receipt.from);
    });

    // //cancelSellToken
    it(`Should be cancel purchase NFT to Market after buy `, async function () {

        let priceNft = ethToWeh(0.05);
        let price = ethToWeh(0.05);
        let listPrice = ethToWeh(0.001);


        const result = await nftMarketContract.connect(owner).getItemId(itemId);
        console.log(result);
        // console.log(result);
        describe('Condition to cancelPurchase NFT', async () => {
            it(`NFT have to be sell on market `, async function () {
                expect(result[3]).to.equal(owner.address);
                expect(result[4]).to.equal(adrNft);
            });
            it(`Price when cancelPrice have to equal price of NFT`, async function () {
                expect(Number(result[5])).to.be.equal(priceNft)
            });
            it(`List price have to equal listing price of market`, async function () {
                expect(listPrice).to.equal(listingPrice);
            });

        });
        const transaction = await nftMarketContract.connect(owner).cancelSaleToken(
            nftContractAddress,
            itemId,
            {
                value: price.toString()
            }
        );
        describe('Run Function cancelPurchase NFT condition', async () => {
            it(`Function active`, async function () {
                expect(transaction).to.not.be.undefined;
            });
        });
        // const receipt = await transaction.wait();
        // console.log(receipt.to);
        // console.log(receipt.from);
    });

    // // //Fetch item transaction
    it(`Should be fetch item `, async function () {
        let metadataURI = "ipfs://QmdnSBLxPTGKRGzwnFuXieVseP77jKfSX4k5w6etjixpYB";
        describe('Condition to Create NFT', () => {
            it(`Metadata URI should not be empty`, async function () {
                expect(metadataURI).not.to.equal('');
            });
        });

        const transaction = await nftContract.connect(owner).createToken(metadataURI);
        const receipt = await transaction.wait();
        // Get the Transfer event
        const transferEvent = receipt.logs
            .map((log) => nftContract.interface.parseLog(log))
            .find((parsedLog) => parsedLog.name === "Transfer");
        // Extract the tokenId from the event
        const tokenId = transferEvent.args[2];
        // Using Number constructor
        const parsedValue = Number(tokenId);
        // console.log(parsedValue);
        itemId = parsedValue;

        //Chuẩn bị dữ liệu
        let price = ethToWeh(0.05);
        let listPrice = ethToWeh(0.001);
        describe('Condition to Listing NFT', () => {
            it(`Price when create item market have to bigger than 0`, async function () {
                expect(price).to.be.above(0)
            });
            it(`List price have to equal listing price of market`, async function () {
                expect(listPrice).to.equal(listingPrice);
            });
        });
        // //buyer bán item
        const result = await nftMarketContract.connect(owner).createMarketItem(
            nftContractAddress,
            itemId,
            price.toString(),
            {
                value: listingPrice
            }
        );
        describe('Run Function Create Market Item condition', async () => {
            it(`Function active`, async function () {
                expect(result).to.not.be.undefined;
            });
        });


        // const transaction = await nftMarketContract.connect(owner).fetchMarketItem();
        const marketItems = await nftMarketContract.connect(owner).fetchMarketItem();

        // Perform assertions on the returned data
        describe('Condition to FetchItem on Market', async () => {
            it(`Value to be array and length bigger than 0`, async function () {
                expect(marketItems).to.be.an("array");
                expect(marketItems.length).to.be.above(0);
                console.log(marketItems);

            });
        });

        const marketItems1 = await nftMarketContract.fetchAllTransaction();
        // Perform assertions on the returned data
        describe('Condition to FetchTransaction on Market', async () => {
            it(`Value to be array and length bigger than 0`, async function () {
                expect(marketItems1).to.be.an("array");
                expect(marketItems1.length).to.be.above(0);
                console.log(marketItems1);

            });
        });



        const marketItems2 = await nftMarketContract.fetchItemsCreated();

        // Perform assertions on the returned data
        describe('Condition to FetchItemCreated on Market', async () => {
            it(`Value to be array and length bigger than 0`, async function () {
                expect(marketItems2).to.be.an("array");
                expect(marketItems2.length).to.be.above(0);
                console.log(marketItems2);

            });
        });
     

        const marketItems3 = await nftMarketContract.fetchMyNFT();
        // Perform assertions on the returned data
        describe('Condition to FetchItemOwned on Market', async () => {
            it(`Value to be array and length bigger than 0`, async function () {
                expect(marketItems3).to.be.an("array");
                expect(marketItems3.length).to.be.above(0);
                console.log(marketItems3);

            });
        });
       
    });



});
