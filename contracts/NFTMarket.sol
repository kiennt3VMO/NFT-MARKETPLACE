// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//Tấn công reentrancy là một loại tấn công mà kẻ tấn công cố gắng thực hiện lặp lại một phương thức trong hợp đồng thông minh trong quá trình thực thi,
// để xâm nhập vào tài sản của hợp đồng.
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // prevents re-entrancy attacks

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;

    //Theo dõi số lượng item của market đc tạo từ token tạo ra của user và đc bán
    Counters.Counter private _itemIds;
    Counters.Counter private _itemSold;
    Counters.Counter private _itemTransaction;
    // owner of smart contract
    address payable owner;

    //User have to pay fee when buy NFT on Market
    uint256 listingPrice = 0.001 ether;
    uint256 cancelPrice = 0.001 ether;

    constructor() {
        //Any deploy smart contract is the owner
        owner = payable(msg.sender);
    }

    //Data of a NFT
    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    struct Transaction {
        uint256 itemId;
        address owner;
        uint256 cost;
        string title;
        string description;
        uint256 timestamp;
    }

    // Use mapping to manage NFT  and Data of NFT
    mapping(uint256 => MarketItem) private idMarketItem;

    mapping(uint256 => Transaction) private transactions;
    //Emit when a item is sold
    //Create a place for variable have indexed for easy to find when log event
    event idMarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    //Get the fee of transaction
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // function setListingPrice(uint256 _price) public returns (uint256) {
    //     if (msg.sender == address(this)) {
    //         listingPrice = _price;
    //     }
    //     return listingPrice;
    // }

    //Creat a item nft for market
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        // CreateInfomationOfToken
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false // false which mean just create and no list on market to sold
        );

        //Transfer owner ship of nft to the market
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit idMarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender, // address of the seller
            address(this), // A empty address(no owner yet)
            price,
            false
        );

        _itemTransaction.increment();
        uint256 itemTransaction = _itemTransaction.current();

        string memory title = "Create Token";
        string
            memory description = "Create new token and listing to the marketplace";
        transactions[itemTransaction] = Transaction(
            itemTransaction,
            msg.sender,
            msg.value,
            title,
            description,
            block.timestamp
        );
    }

    //When user want to resale token that buyed
    function reSellToken(
        address nftContract,
        uint256 itemId,
        uint256 price
    ) public payable {
        // rePostTokenForSale
        require(
            idMarketItem[itemId].owner == msg.sender,
            "Only item owner can perform this operation"
        );

        require(msg.value == listingPrice, "Price must equal to listing price");
        idMarketItem[itemId].sold = false;
        idMarketItem[itemId].price = price;
        idMarketItem[itemId].seller = payable(msg.sender);
        idMarketItem[itemId].owner = payable(address(this));
        //NFT được đăng lại bởi người bán và chưa được mua lại.
        _itemSold.decrement();

        IERC721(nftContract).transferFrom(
            msg.sender,
            address(this),
            idMarketItem[itemId].tokenId
        );

        _itemTransaction.increment();
        uint256 itemTransaction = _itemTransaction.current();

        string memory title = "Resale Token";
        string memory description = "Sale a token after we buy this";
        transactions[itemTransaction] = Transaction(
            itemTransaction,
            msg.sender,
            msg.value,
            title,
            description,
            block.timestamp
        );
    }

    function cancelSaleToken(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint256 price = idMarketItem[itemId].price;
        uint256 tokenId = idMarketItem[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to compelete the market"
        );
        //Seller get the money that sell nft
        idMarketItem[itemId].seller.transfer(msg.value);
        //Transfer owner ship of nft to the market
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        //Owner of nft is the buyer
        idMarketItem[itemId].owner = payable(msg.sender);
        idMarketItem[itemId].seller = payable(msg.sender);
        idMarketItem[itemId].sold = false;

        _itemSold.increment();

        payable(owner).transfer(listingPrice);

        _itemTransaction.increment();
        uint256 itemTransaction = _itemTransaction.current();

        string memory title = "Cancel Sale Token";
        string memory description = "Cancel token that listing on marketplace";
        transactions[itemTransaction] = Transaction(
            itemTransaction,
            msg.sender,
            listingPrice,
            title,
            description,
            block.timestamp
        );
    }

    //When user want to buy a nft , user call this function and tranfe amount of ether/wei
    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint256 price = idMarketItem[itemId].price;
        uint256 tokenId = idMarketItem[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to compelete the market"
        );
        //Seller get the money that sell nft
        idMarketItem[itemId].seller.transfer(msg.value);
        //Transfer owner ship of nft to the market
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        //Owner of nft is the buyer
        idMarketItem[itemId].owner = payable(msg.sender);
        idMarketItem[itemId].seller = payable(msg.sender);
        idMarketItem[itemId].sold = true;

        _itemSold.increment();

        payable(owner).transfer(listingPrice);

        _itemTransaction.increment();
        uint256 itemTransaction = _itemTransaction.current();

        string memory title = "Buy Token";
        string memory description = "Owned token by buying token";
        transactions[itemTransaction] = Transaction(
            itemTransaction,
            msg.sender,
            msg.value,
            title,
            description,
            block.timestamp
        );
    }

    //List of item on market that unsold
    function fetchMarketItem() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unSoldItemCount = itemCount - _itemSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unSoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            //If nft is equal empty address that mean nft unsold
            if (idMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = idMarketItem[i + 1].itemId;
                MarketItem memory currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchAllTransaction() public view returns (Transaction[] memory) {
        uint256 itemCount = _itemTransaction.current();
        uint256 currentIndex = 0;
        Transaction[] memory items = new Transaction[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            //If nft is equal empty address that mean nft unsold
            uint256 currentId = i + 1;
            Transaction memory currentItem = transactions[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function fetchAllItem() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            //If nft is equal empty address that mean nft unsold
            uint256 currentId = idMarketItem[i + 1].itemId;
            MarketItem memory currentItem = idMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    //List of item that the owner/buyer is the user
    function fetchMyNFT() public view returns (MarketItem[] memory) {
        //GetAllItemBuyByUser Or Create and not sale
        uint256 totalCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < totalCount; i++) {
            //If owner is user then count
            if (idMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalCount; i++) {
            //If owner is user then add into new list and return
            if (idMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = idMarketItem[i + 1].itemId;
                MarketItem memory currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    //List of item that the seller is the user
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint256 totalCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            //If owner is user then count
            if (idMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalCount; i++) {
            //If owner is user then add into new list and return
            if (idMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = idMarketItem[i + 1].itemId;
                MarketItem memory currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
