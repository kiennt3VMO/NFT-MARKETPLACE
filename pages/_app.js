import "../styles/index.css"
import React from 'react';
import '../styles/globals.css'
import Link from 'next/link'
import { logo } from "@/config";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal'
import { truncate } from "./service/service";

export default function App({ Component, pageProps }) {
  const [signer, setSigner] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchAccount = async () => {
      if (typeof window.ethereum !== 'undefined'
        && signer) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        setSigner(accounts[0]);

        const handleAccountsChanged = (newAccounts) => {
          // console.log(newAccounts);
          setSigner(newAccounts[0]);
          router.reload();
        };
        window.ethereum.on('accountsChanged', handleAccountsChanged);
      }
    };
    fetchAccount();
  }, [])

  async function ConnectMetamask() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider1 = new ethers.providers.Web3Provider(connection);
    const signer1 = provider1.getSigner(); // lấy địa chỉ ví đang đăng nhập
    const signerAddress = await signer1.getAddress();
    setSigner(signerAddress);
    console.log(signer);
    // router.reload();
  }
  return (
    <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
      <div className=" w-4/5 flex justify-between md:justify-center items-center py-4 mx-auto">
        <div className="md:flex-[0.5] flex-initial justify-center items-center ">
          <img className="w-32 cursor-pointer rounded-md"
            src={logo}
            alt="Logo" />
        </div>
        <ul className="md:flex[0.5] text-white md:flex
      hidden list-none justify-between items-center flex-initial">
          <li >
            <Link href="/">
              <button className='mx-8 cursor-pointer"'>Home</button>
            </Link>
          </li>
          <li >
            <Link href="/create">
              <button className='mx-8 cursor-pointer"'>Sell NFT</button>
            </Link>
          </li>
          <li >
            <Link href="/owned">
              <button className='mx-8 cursor-pointer"'>Owned</button>
            </Link>
          </li>
          <li >
            <Link href="/statics">
              <button className='mx-8 cursor-pointer"'>Statics</button>
            </Link>
          </li>
        </ul>

        {typeof signer === "undefined" ? (
          <button className="shadow-xl shadow-blue-400 text-white 
        bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-2 rounded-full"
            onClick={ConnectMetamask}>
            Connect Wallet
          </button>
        ) : (
          <button className="shadow-xl shadow-blue-400 text-white 
      bg-[#44b8e6] hover:bg-[#258dd3] md:text-xs p-3 rounded-full"
      onClick={ConnectMetamask}>
            {truncate(signer, 5,3, 11)}
          </button>
        )

        }
      </div>
      <Component {...pageProps} />
    </div>

  )
}
