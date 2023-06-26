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
import BackButton from "./components/BackButton";
function owned() {
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
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
            const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
            //List of item that unsold
            const data = await marketContract.fetchMyNFT();
            const items = await Promise.all(data.map(async i => {
                const tokenUri = await tokenContract.tokenURI(i.tokenId);
                console.log(tokenUri);
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
            console.log(items);
            setNfts(items);
            setLoadingState('loaded');
            console.log("load success");
        } catch (error) {
            console.log("Load failed , Server dropped");
            console.log(error);
        }
    }
    return (
        <div
            className="w-4/5 
    mx-auto py-10">
            <Head>
                <title>NFT Buyed</title>
            </Head>
            <h4
                className="text-white text-3xl font-bold uppercase
    opacity-70" >
                NFT Owned
            </h4>
            <BackButton />
            {/* NFT Section */}

            {/* Map (nft,i)*/}
            {/*<Card  key{i} nft{nft}/>  */}
            {
                loadingState === 'loaded' && !nfts.length ? (
                    <h6
                        className="text-white text-2xl font-mono
                            opacity-70 text-center"
                    >
                        No nft Owned
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
    )
}

export default owned

