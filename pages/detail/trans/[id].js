import Identicon from "react-identicons";
import { useRouter } from 'next/router';
import Head from "next/head";
import { useEffect, useState } from 'react'
import BackButton from "../../components/BackButton";
import { ethers } from 'ethers'
import { nftAddress, nftMarketAddress } from '@/config'
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import axios from "axios";
import { regexTime } from "@/pages/service/service";
function transDetail() {
    const router = useRouter();
    const [transaction, setTrans] = useState([])
    useEffect(() => {
        loadTrans();
    }, [])
    async function loadTrans() {
        const pathname = window.location.pathname;
        // console.log(pathname);
        const id = pathname.replace("/detail/trans/", "");
        // const check = pathname.includes("detail");
        let idNumber = parseInt(id);
        console.log(idNumber);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
            const data = await marketContract.fetchAllTransaction()

            const items = await Promise.all(data.map(async i => {
                const date = new Date(i.timestamp * 1000); // Để chuyển đổi timestamp từ giây thành mili-giây, nhân với 1000
                const currentDate = date.toISOString();
                let cost = ethers.utils.formatUnits(i.cost.toString(), 'ether')
                let item = {
                    itemId: i.itemId.toNumber(),
                    owner: i.owner,
                    cost: cost,
                    title: i.title,
                    description: i.description,
                    timestamp: currentDate,
                }
                return item;
            }))
            /* create a filtered array of items that have been sold */
            // console.log(items);
            const transaction = items.filter(i => i.itemId == idNumber);
            console.log(transaction[0]);
            // console.log(items.length);
            setTrans(transaction[0]);
            console.log("Load Transaction");
        } catch (error) {
            console.log("Not load transaction");
        }
    }

    return (
        <div
            className="flex flex-col md:flex-row w-4/5 justify-between
      items-center mx-auto py-10"
        >
            <Head>
                <title>Transaction Detail</title>
            </Head>
            <div className="md:w-4/5 w-full py-5 ">
                {/* Head content */}
                <div className='text-center'>
                    <h1
                        className="text-white text-5xl
      font-bold"
                    >
                        Transaction Detail <br />
                    </h1>
                </div>

                <BackButton />

                <div className='
              shadow-xl shadow-yellow-50 
              overflow-hidden
              ml-5 flex flex-col justify-start
          rounded-md  p-5 mt-5'>
                    <div className="flex flex-row ">
                        <h4 className='text-white font-semibold mr-5'>Item</h4>
                        <p className='text-black text-lg '>{transaction.itemId}</p>
                    </div>
                    <div className="flex flex-col">
                    <h4 className='text-white font-semibold'>Title</h4>
                        <p className='text-black text-lg '>{transaction.title}</p>
                        <h4 className='text-white font-semibold'>Description</h4>
                        <p className='text-black text-lg '>{transaction.description}</p>
                        <h4 className='text-white font-semibold'>Time</h4>
                        <p className='text-black text-lg '>
                        {regexTime(transaction.timestamp)}</p>
                    </div>

                    <div className='flex  justify-between items-center mt-3 text-white'>
                        <div className="flex justify-start items-center">
                            <Identicon
                                className="h-10 w-10 object-contain rounded-full mr-3"
                                string={"yqwe3shgxnfb"}
                                size={100}
                            />
                            <div className="flex flex-col justify-center">
                                <small className="text-blue-800 font-bold">@Owner</small>
                                <small className="font-semibold text-black text-lg">
                                    {transaction.owner}
                                </small>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <small className="text-blue-800 font-bold">Cost</small>
                            <small className="font-semibold text-black text-lg">{transaction.cost} ETH</small>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default transDetail;
