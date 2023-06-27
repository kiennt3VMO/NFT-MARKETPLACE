import { MdOpenInNew } from "react-icons/md"
import { truncate } from "../service/service"
import Link from 'next/link'
const Transaction = ({ tran }) => {
    return (
        <div className="flex justify-between items-center 
         w-full shadow-xl shadow-yellow-50 rounded-md
        overflow-hidden  my-2 p-3
           ">
            <div className="rounded-md shadow-sm shadow-yellow-50 p-2">
                <Link
                    href={`/detail/transaction/${1}`}
                >
                    <MdOpenInNew />
                </Link>
            </div>

            <div >
                <h4 className="text-sm text-center font-semibold">Transaction Success</h4>
                <small className="flex justify-start items-center">
                    Received by  <span className="font-bold">#{truncate(tran.owner, 4, 4, 11)}</span>
                    <a href="#" target="_blank" className="text-white"></a>

                </small>
            </div>
            <p className="text-sm font-medium">{tran.cost} ETH</p>
        </div>
    )
}
export default Transaction