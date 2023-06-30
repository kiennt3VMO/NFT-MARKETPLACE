import Link from 'next/link'
const Card = ({ nft }) => {
  // console.log(name);
  // console.log(nft.description);
  return (
    <div  className=" w-full 
          shadow-xl shadow-yellow-50
          rounded-md overflow-hidden
           my-2 p-3
           ">
      <img
        className="h-60 w-full
             object-cover shadow-lg shadow-yellow-100
             rounded-lg mb-5"
        src={nft.image}
        alt="NFT"

      />
      <h4 className="font-semibold">{nft.name}</h4>
      <p className=" my-1">{nft.description}</p>
      <div className="flex justify-between items-center mt-3 ">
        <div className="flex flex-col">
          <small className="text-xs">Current Price</small>
          <p className="text-sm font-semibold">{nft.price} ETH</p>
        </div>
        <Link
          href={`/detail/${nft.itemId}`}
        >
          <button className=" border 
               shadow-xl shadow-blue-400 text-white 
               hover:opacity-30 md:text-xs p-2 rounded-full">
            View Details</button>
        </Link>


      </div>
    </div>
  )
}
export default Card