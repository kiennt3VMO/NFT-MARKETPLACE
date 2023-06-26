import {
    apikey,
    apiSecret,
    gateWay,
    ipfsGateWay,
    readHeader,
    getHeader,
    sendJsonHeader
  } from "../../config";
  import axios from "axios";
  
  export async function sendJSONToIPFS(name, des,file,price) {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    const cid = await sendFileToIPFS(file);
    const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/'+cid;
    const data = {
        "pinataMetadata": {
            "name": "NFT Collection"
        },
        "pinataOptions": {
            "cidVersion": 1
        },
        "pinataContent": {
                "name": name,
                "description": des,
                "price":price,
                "image": ipfsGateway.toString()
        }
    };
    try {
        const response = await axios.post(url, data, sendJsonHeader);
        const hash = `ipfs://${response.data.IpfsHash}`;
        return hash;
    } catch (error) {
        console.error("Error pinning JSON to IPFS:", error);
    }
  }
  async function sendFileToIPFS(file) {
    const formData = new FormData();
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    formData.append("file", file);
    const opts = {
        "cidVersion": 1
    }
    formData.append("pinataOptions", JSON.stringify(opts));
    const options = {
        maxBodyLength: "Infinity",
        headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: apikey,
            pinata_secret_api_key: apiSecret,
            Accept : "text/plain",
  
        }
    }
    const sendPic = await axios.post(url,formData,options);
    return sendPic.data.IpfsHash;
  }