import React from "react";
import Head from "next/head";
import { useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { nftAddress, nftMarketAddress } from '@/config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import Image from 'next/image'
import {sendJSONToIPFS} from "./servicePinata/pinata";
import { useRouter } from 'next/router';
const create = () => {
  const [fileUrl, setFileUrl] = useState(null);
    const [cid, setCid] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter();
    async function onChange(e) {
      try {
        if(formInput.name.length > 0 &&
          formInput.description.length > 0 &&
          formInput.price.length > 0 ){

            const file = e.target.files[0];
            const receipt = await sendJSONToIPFS(formInput.name,
                formInput.description, file,
                formInput.price);
                setCid(receipt.toString());
            const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';
            const cid = receipt.replace('ipfs://', '');
            const tokenUriWithGateway = ipfsGateway + cid;
           //  console.log(tokenUriWithGateway.toString());
            const meta = await axios.get(tokenUriWithGateway);
            setFileUrl(meta.data.image.toString());
           //  console.log(fileUrl.toString());
          //  console.log(formInput.name);
          //  console.log(formInput.description);
          //  console.log(formInput.price);
    
            console.log("Load Done!");
          }else{
            console.log("Field is empty");
          }
      } catch (error) {
       console.log("Service Fail ,Please try again after 15 minutes!");
      }

   }

   //2. Create item for sale
   async function createItem() {
       try {
           const provider = new ethers.providers.Web3Provider(window.ethereum);
           const signer = provider.getSigner();
           //Contract NFT
           let nft = new ethers.Contract(nftAddress, NFT.abi, signer);
          //  console.log(cid);
           let transaction = await nft.createToken(cid);
           let tx = await transaction.wait();
           let tokenId = tx.events[0].args[2].toNumber();
           const price = ethers.utils.parseUnits(formInput.price, 'ether');
           console.log(tokenId);
           //Contract MarketPlace
           let market  = new ethers.Contract(nftMarketAddress, Market.abi, signer);
           let listingPrice = await market.getListingPrice();
           listingPrice = listingPrice.toString();
           await market.createMarketItem(nftAddress, tokenId, price,
               { value: listingPrice });
               setTimeout(()=>{
                   router.push('/');
               },2000);
       } catch (error) {
           console.log("Fail");
       }
   }

  return (
    <div
      className="flex flex-col md:flex-row w-4/5 justify-between
      items-center mx-auto py-10"
    >
         <Head>
                <title>Listing NFT</title>
            </Head>
      <div className="md:w-4/5 w-full text-center">
        <div>
          <h1
            className="text-white text-5xl
      font-bold"
          >
            Create And Listing NFT <br />
          </h1>
        </div>
        <div className="flex flex-col">
          <input
            required
            placeholder="Name"
            className="mt-8 border rounded p-4 cursor-pointer
            "
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            required
            placeholder="Description"
            className="mt-2 border rounded p-4 cursor-pointer"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
            rows={7}
          />
          <input
            required
            placeholder="Price in Eth"
            className="mt-2 border rounded p-4 cursor-pointer"
            type="number"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          <input type="file" name="Asset" className="my-4 cursor-pointer
          text-slate-500 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0 file:text-sm file:font-semibold
          hover:file:bg-[#1fa0c0]  hover:file:text-white"   onChange={onChange} />
           {
                    fileUrl && (
                      <img
                      className="h-full w-full
                      object-cover shadow-lg shadow-yellow-100
                      rounded-lg mb-5"
                        src={fileUrl} 
                        alt="NFT"
                      />
                    )
                }
         
        </div>

        <div className="flex mt-5 justify-end w-full">
          <button
            className="w-full h-10 shadow-xl shadow-blue-400 text-white 
          bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-2 rounded-full "
          onClick={createItem} >
            Create NFT
          </button>
        </div>
      </div>
    </div>
  );
};
export default create;
