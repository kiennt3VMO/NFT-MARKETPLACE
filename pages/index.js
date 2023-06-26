import React from "react";
import Identicon from "react-identicons";
import Card from "./components/Card";
import Transaction from "./components/Transaction";
import { logo } from "@/config";
import Head from 'next/head';
import Link from 'next/link'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal'
import { nftAddress, nftMarketAddress } from '@/config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import axios from "axios";
import { truncate } from "./service/service";
const img1 =
    "https://img.freepik.com/free-vector/gradient-nft-concept-illustrated_52683-61452.jpg?w=1380&t=st=1687340931~exp=1687341531~hmac=eafb19a5bad33a80cc53b5a8ac605e515e54b5f980c87224cb5310f087aaf677";

export default function Home() {
    const router = useRouter();
    const [nfts, setNfts] = useState([]);
    const [signer, setSigner] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    useEffect(() => {
        loadNFTs();
    }, [])

    async function loadNFTs() {
        try {
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
            const data = await marketContract.fetchMarketItem();
            const items = await Promise.all(data.map(async i => {
                const tokenUri = await tokenContract.tokenURI(i.tokenId);
                // console.log(tokenUri);
                const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';
                const cid = tokenUri.replace('ipfs://', '');
                const tokenUriWithGateway = ipfsGateway + cid;
                const meta = await axios.get(tokenUriWithGateway);
                // console.log(tokenUri);
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
                // console.log(i.seller.toString());
                return {
                    price,
                    itemId: i.itemId.toNumber(),
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                    name: meta.data.name === "" ? "#Empty" : meta.data.name,
                    description: meta.data.description === "" ? "#Empty" : meta.data.description
                };


            }));
            setNfts(items);
            setLoadingState('loaded');
        } catch (error) {
            console.log("Load failed , Server dropped");
            // console.log(error);
        }


    }
    return (

        <div className="Content_Footer">
            <Head>
                <title>NFT Market</title>
            </Head>
            {/* v */}
            <div className="Content_Section">
                {/* First Content */}
                <div
                    className="flex flex-col md:flex-row w-4/5 justify-between
    items-center mx-auto py-10"
                >
                    <div className="md:w-3/6 w-full">
                        <div>
                            <h1
                                className="text-white text-5xl
                font-bold"
                            >
                                Buy And Sell <br />
                                Digital Arts,
                                <span className="opacity-70">NFTs </span>Collections
                            </h1>
                            <p
                                className="text-yellow-100 font-semibold
                text-sm mt-3"
                            >
                                Mint and collect the hottest NFTs around
                            </p>
                        </div>

                        <div className="flex mt-5">
                            <Link href="/create">
                                <button
                                    className="cursor-pointer shadow-xl shadow-blue-400 text-white 
                                 bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-2 rounded-full"> Create NFT</button>
                            </Link>
                        </div>

                        <div className="w-3/4 flex justify-between items-center mt-5">
                            <div className="text-white">
                                <p className="font-bold">123k</p>
                                <small className="text-gray-300">Users</small>
                            </div>

                            <div className="text-white">
                                <p className="font-bold">123k</p>
                                <small className="text-gray-300">Artwork</small>
                            </div>

                            <div className="text-white">
                                <p className="font-bold">123k</p>
                                <small className="text-gray-300">Artists</small>
                            </div>
                        </div>
                    </div>

                    <div
                        className="shadow-xl shadow-black md:w-2/5 w-full
        mt-10 md:mt-0 rounded-md overflow-hidden "
                    >
                        <img className="h-60 w-full object-cover" src={img1} alt="" />
                        <div className="flex justify-start items-center p-3">
                            <Identicon
                                className="h-10 w-10 object-contain rounded-full mr-3"
                                string={"0x21....789a"}
                                size={50}
                            />
                            <div>
                                <small className="text-blue-800 font-bold">@you</small>
                                {typeof signer === "undefined" ? (
                                    <p className="text-white font-semibold">0x3....12323</p>

                                ) : (
                                    <p className="text-white font-semibold">  {truncate(signer, 4, 4, 11)}</p>
                                )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* Second Content */}
                <div
                    className="w-4/5 
        mx-auto py-10"
                >
                    <h4
                        className="text-white text-3xl font-bold uppercase
          opacity-70"
                    >
                        NFT Collections
                    </h4>
                    {/* NFT Section */}

                    {/* Map (nft,i)*/}
                    {/*<Card  key{i} nft{nft}/>  */}
                    {
                        loadingState === 'loaded' && !nfts.length ? (
                            <h6
                                className="text-white text-1xl font-bold uppercase
                                opacity-70 text-center"
                            >
                                No items in market place
                            </h6>
                        ) : (
                            <div
                                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4
                                gap-6 md:gap-4 lg:gap-3 py-2.5">
                                {
                                    nfts.map((nft, i) => (
                                        <Card key={i} nft={nft} />
                                    ))
                                }
                            </div>
                        )
                    }
                    {
                        (loadingState === 'loaded' && !nfts.length) ? (
                            <div className="text-center my-5 ">
                                <button className="  text-white 
       md:text-xs p-2 rounded-full">

                                </button>
                            </div>
                        ) : (
                            <div className="text-center my-5 ">
                                <button className="disabled shadow-xl shadow-blue-400 text-white 
      bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-2 rounded-full">
                                    Load more
                                </button>
                            </div>
                        )
                    }

                </div>
                {/* Transaction */}

                <div
                    className="w-4/5 
        mx-auto py-10">
                    <h4
                        className="text-white text-3xl font-bold uppercase
          opacity-70">
                        Latest Transaction
                    </h4>

                    <Transaction nft={1} />
                    <Transaction nft={2} />
                    <Transaction nft={2} />

                    <div className="text-center my-5">
                        <button className="shadow-xl shadow-blue-400 text-white 
      bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-2 rounded-full">
                            Load more
                        </button>
                    </div>


                </div>
            </div>

            <div className="Footer flex flex-col md:justify-center
            justify-between items-center p-4 ">
                <div className="w-full flex sm:flex-row flex-col justify-between
                items-center my-4">
                    <div className="flex flex-[0.25] justify-center
                    items-center ">
                        <img className="w-20 cursor-pointer rounded-md" src={logo} alt="Logo" />
                    </div>

                    <div className="flex flex-1 justify-evenly items-center flex-wrap
                    sm:mt-0 mt-5 w-full text-white text-base text-center">
                        <p className="cursor-pointer mx-2 "> Market</p>
                        <p className="cursor-pointer mx-2 "> Artists</p>
                        <p className="cursor-pointer mx-2 "> Features</p>
                        <p className="cursor-pointer mx-2 "> Help</p>
                    </div>

                    <div className="flex flex-[0.25] justify-center items-center">
                        <p className="text-white text-right text-sm">&copy;2023 All rights revserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

