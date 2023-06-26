import Identicon from "react-identicons";
import { useRouter } from 'next/router';
import Head from "next/head";
import { useEffect, useState } from 'react'
import BackButton from "../components/BackButton";
import { ethers } from 'ethers'
import { nftAddress, nftMarketAddress } from '@/config'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import axios from "axios";
import { truncate } from "../service/service";
function detail() {
  const router = useRouter();
  const [nfts, setNfts] = useState([]);
  const [signer, setSigner] = useState([]);
  useEffect(() => {
    loadNFTs();
  }, [])
  async function loadNFTs() {
    const pathname = window.location.pathname;
    // console.log(pathname);
    const id = pathname.replace("/detail/", "");
    // const check = pathname.includes("detail");
    // console.log(check);
    // console.log(id);
    let idNumber = parseInt(id);
    // console.log(idNumber);
    try {
      // Use the fetched ID or perform further operations
      //lấy tài khoàn đang kết nối metamask
      const provider1 = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider1.listAccounts();
      setSigner(accounts[0]);

      //JsonProvider cung cấp chức năng để tương tác với mạng Ethereum thông qua   API JSON-RPC của Alchemy.
      const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/9gd2hZXDxdArvE90PAizgM0Wpf5rm7NI');
      //Connect smart contract
      const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
      const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider);
      //List of item that unsold
      const data = await marketContract.fetchAllItem();
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // console.log(tokenUri);
        const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';
        const cid = tokenUri.replace('ipfs://', '');
        const tokenUriWithGateway = ipfsGateway + cid;
        const meta = await axios.get(tokenUriWithGateway);
        // console.log(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        return {
          price,
          itemId: i.itemId.toNumber(),
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        };
      }));
      const soldItems = items.filter(i => i.itemId == idNumber);
      // nft = soldItems[0];
      setNfts(soldItems);
      // console.log(items);
    } catch (error) {
      console.log("Load failed , Server dropped");
      console.log(error);
    }
  }
  async function buyNFT(nft) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      //Conenct smart contract
      const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
      //chuyển đổi giá trị nft.price sang đơn vị wei bằng cách sử dụng ethers.utils.parseUnits():
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
      // console.log(nft.price);
      // // console.log(price);
      // // console.log(nft.price.toString());
      const transaction = await contract.createMarketSale(nftAddress, nft.itemId,
        {
          value: price
        });
      await transaction.wait();
      console.log("Buy Successfully!");
      router.push('/');
      // loadNFTs();
    } catch (error) {
      console.log("Not connected to metamask");
    }

  }

  async function reSale(nft) {
    try {
      //tạo một đối tượng Web3Modal để khởi tạo và cấu hình kết nối với ví Web3:
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
    //Conenct smart contract
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
    //chuyển đổi giá trị nft.price sang đơn vị wei bằng cách sử dụng ethers.utils.parseUnits():
    const price = ethers.utils.parseUnits(nft.price, 'ether');
    // console.log(price.toNumber());
    // console.log(nft.tokenId);
    // console.log(nft.price.toString());
    let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();
    const transaction = await contract.reSellToken(nftAddress, nft.tokenId,price,
      {
        value: listingPrice
      });
    await transaction.wait();
    console.log("Success Resale");
    } catch (error) {
        console.log("Fail");
    }
  }
  async function cancelSale(nft) {
    try {
      await buyNFT(nft);
      await reSale(nft);
      await buyNFT(nft);
      // console.log(nft.tokenId);
      // console.log(nft.itemId);
      console.log("Cancel Successfully!");
      // router.reload();
      loadNFTs();
    } catch (error) {
      console.log("fail!");
      console.log(error);
    }
  }
  return (
    <div
      className="flex flex-col md:flex-row w-4/5 justify-between
    items-center mx-auto py-10"
    >
      <Head>
        <title>NFT Detail</title>
      </Head>
      <div className="md:w-4/5 w-full py-5 ">
        {/* Head content */}
        <div className='text-center'>
          <h1
            className="text-white text-5xl
    font-bold"
          >
            NFT Detail <br />
          </h1>
        </div>

        <BackButton />
        {/* NFT Information */}

        {
          nfts.map((nft, i) => (
            <div key={i} className='ml-5 flex flex-col justify-start
        rounded-xl mt-5'>
              <img
                className=" 
             object-cover shadow-lg shadow-yellow-100
             rounded-lg mb-5"
                src="https://gateway.pinata.cloud/ipfs/bafkreibwosm7qrrkzinrnrz67dljxui7d6eh7k7rue6vjsccuse5ack2r4"
                alt="NFT"
              />
              <div className="flex flex-col">
                <h4 className='text-white font-semibold'>Name</h4>
                <p className='text-yellow-200 text-xs my-1'>{nft.name}</p>
                <h4 className='text-white font-semibold'>Description</h4>
                <p className='text-yellow-200 text-xs my-1'>{nft.description}</p>
              </div>

              <div className='flex  justify-between items-center mt-3 text-white'>
                <div className="flex justify-start items-center">
                  <Identicon
                    className="h-10 w-10 object-contain rounded-full mr-3"
                    string={"yqwe3shgxnfb"}
                    size={50}
                  />
                  <div className="flex flex-col justify-center">
                    <small className="text-blue-800 font-bold">@Owner</small>
                    <small className="font-semibold text-black">
                      {truncate(nft.owner, 4, 4, 11)}
                    </small>
                  </div>
                </div>

                <div className="flex justify-start items-center">
                  <Identicon
                    className="h-10 w-10 object-contain rounded-full mr-3"
                    string={"0x12...01231"}
                    size={50}
                  />
                  <div className="flex flex-col justify-center">
                    <small className="text-blue-800 font-bold">@Seller</small>
                    <small className="font-semibold text-black">
                      {truncate(nft.seller, 4, 4, 11)}
                    </small>
                  </div>
                </div>

                <div className="flex flex-col">
                  <small className="text-blue-800 font-bold">Current Price</small>
                  <small className="font-semibold text-black">{nft.price} ETH</small>
                </div>
              </div>
              {/* Button */}
              {
                
                    nft.owner == signer ? (
                      <div className=" flex mt-7 justify-end w-full">
                        <button
                          className="w-full h-10 shadow-xl shadow-blue-400 text-white 
          bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-2 rounded-full"
          onClick={() => reSale(nft)}    >
                          Repurchase NFT
                        </button>
                      </div>
                    ) : (
                       nft.seller == signer ? (
                        <div className=" flex mt-7 justify-end w-full">
                        <button
                          className="w-full h-10 shadow-xl shadow-blue-400 text-white 
          bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-2 rounded-full"
           onClick={() => cancelSale(nft)} >
                          Cancel Purchase NFT
                        </button>
                      </div>
                      ):(
                        <div className=" flex mt-7 justify-end w-full">
                        <button
                          className="w-full h-10 shadow-xl shadow-blue-400 bg-[#44b8e6] text-white  md:text-xs p-2 rounded-full "
                          onClick={() => buyNFT(nft)}  >
                        Purchase NFT
                        </button>
                      </div>
                      )
                     
                    )
                
              }
            </div>

          ))

        }


      </div>
    </div>
  );
}

export default detail;
