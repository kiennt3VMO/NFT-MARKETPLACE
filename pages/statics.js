import React from 'react'
import Card from "./components/Card";
import Head from 'next/head';
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { nftAddress, nftMarketAddress } from '@/config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import axios from "axios";
import { ethers } from 'ethers'
import Transaction from "./components/Transaction";
function statics() {
    const [nfts, setNfts] = useState([])
    const [transaction, setTrans] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
        loadTrans()
    }, [])
    async function loadNFTs() {
        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
            const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
            const data = await marketContract.fetchItemsCreated()

            const items = await Promise.all(data.map(async i => {
                const tokenUri = await tokenContract.tokenURI(i.tokenId)
                //   const meta = await axios.get(tokenUri)
                const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';
                const cid = tokenUri.replace('ipfs://', '');
                // console.log(cid);
                const tokenUriWithGateway = ipfsGateway + cid;
                // console.log(tokenUriWithGateway);
                const meta = await axios.get(tokenUriWithGateway);
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
                let item = {
                    price,
                    itemId: i.itemId.toNumber(),
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description,
                    sold: i.sold,
                }
                return item
            }))
            /* create a filtered array of items that have been sold */
            // console.log(items);
            const soldItems = items.filter(i => i.sold == true)
            const saleItems = items.filter(i => i.sold == false)
            console.log(items);
            setSold(soldItems)
            setNfts(saleItems)
            setLoadingState('loaded')
        } catch (error) {
            console.log("Not connected to metamask");
        }
    }
    async function loadTrans() {
        // try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
            const data = await marketContract.fetchAllTransaction()

            const items = await Promise.all(data.map(async i => {
                const date = new Date(i.timestamp * 1000); // Để chuyển đổi timestamp từ giây thành mili-giây, nhân với 1000
                    const currentDate = date.toISOString(); 
                let cost = ethers.utils.formatUnits(i.cost.toString(), 'ether')
                let item = {
                    itemId : i.itemId.toNumber(),
                    owner : i.owner,
                    cost: cost,
                    title: i.title,
                    description: i.description,
                    timestamp: currentDate,
                }
                return item;
            }))
            /* create a filtered array of items that have been sold */
            // console.log(items);

            console.log(items);
            // console.log(items.length);
            setTrans(items);
            console.log("Load Transaction");
        // } catch (error) {
        //     console.log("Not load transaction");
        // }
    }
    return (
        <div
            className="w-4/5 
    mx-auto py-10">
            <div>
                <Head>
                    <title>NFT Statics</title>
                </Head>
                <h4
                    className="text-white text-3xl font-bold uppercase
    opacity-70" >
                    NFT Created
                </h4>
                {/* NFT Section */}
                {
                    loadingState === 'loaded' && !nfts.length ? (
                        <h6
                            className="text-white text-2xl font-mono
                                opacity-70 text-center"
                        >
                            No nft Saled
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
                            <button className="shadow-xl shadow-blue-400 text-white 
                bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-2 rounded-full">
                                Load more
                            </button>
                        </div>
                    )
                }
            </div>

            <div>
                <h4
                    className="text-white text-3xl font-bold uppercase
    opacity-70" >
                    NFT Sold
                </h4>
                {/* NFT Section */}
                {
                    sold.length > 0 ? (
                        <div
                            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4
                            gap-6 md:gap-4 lg:gap-3 py-2.5">
                            {
                                sold.map((nft, i) => (
                                    <Card key={i} nft={nft} />
                                ))
                            }
                            <div className="text-center my-5 ">
                                <button className="shadow-xl shadow-blue-400 text-white 
    bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-2 rounded-full">
                                    Load more
                                </button>
                            </div>
                        </div>
                    ) : (
                        <h6
                            className="text-white text-2xl font-mono
                            opacity-70 text-center"
                        >
                            No nft Sold
                        </h6>


                    )
                }

            </div>

            <div>
                <h4
                    className="text-white text-3xl font-bold uppercase
    opacity-70" >
                    Transaction
                </h4>

                <div
                    className="grid grid-col
                            gap-6 md:gap-4 lg:gap-3 py-2.5">
                  
                   {
                     transaction.length > 0 ? (
                        transaction.map((tran, i) => (
                            <Transaction key={i} tran={tran} />
                         ))
                     ) : (
                        <h6
                        className="text-white text-2xl font-mono
                        opacity-70 text-center"
                    >
                        No Transaction 
                    </h6>
                     )
                  
                   }
                    <div className="text-center my-5 ">
                        <button className="shadow-xl shadow-blue-400 text-white 
    bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-2 rounded-full">
                            Load more
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default statics