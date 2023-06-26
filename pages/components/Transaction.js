import { BiTransfer } from "react-icons/bi"
import { MdOpenInNew } from "react-icons/md"

const Transaction = ({nft}) => {
    return (
        <div className="flex justify-between items-center 
         w-full shadow-xl shadow-yellow-50 rounded-md
        overflow-hidden  my-2 p-3
           ">
            <div className="rounded-md shadow-sm shadow-yellow-50 p-2">
                <BiTransfer />
            </div>

            <div >
                <h4 className="text-sm font-semibold"># {nft} Func Transfered</h4>
                <small className="flex justify-start items-center">
                    <span>Received by </span>
                    <a href="#" target="_blank" className="text-white">0x21...037e</a>
                    <span>
                        <MdOpenInNew />
                    </span>
                </small>
            </div>
            <p className="text-sm font-medium">0.32 ETH</p>
        </div>
    )
}
export default Transaction