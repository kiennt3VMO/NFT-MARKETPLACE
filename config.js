export const logo = "https://img.freepik.com/free-vector/flat-design-nft-concept_52683-62388.jpg?w=826&t=st=1687401734~exp=1687402334~hmac=2c187031162789603de57149f6b76d6f6c01b02dabed240129d0ff305c9c81bb";
export const nftAddress = "0xD4F4D76Fb735F5f33EFBD64A5816635757f28630"
export const nftMarketAddress = "0x68Dc00A91155122484DE693684f5Efa599684c22"


export const apikey = "7bfbd023be89f92aa223";
export const ipfsGateWay = "coffee-polite-tick-583";
export const readHeader = {
    "Content-Type": "application/json",
}
export const getHeader = {
    headers: {
        pinata_api_key: apikey,
        pinata_secret_key: process.env.API_KEY
    }
}
export const sendJsonHeader = {
    headers: {
        "Content-Type": "application/json",
        'pinata_api_key': apikey,
        'pinata_secret_api_key':  process.env.API_KEY,
    }
}



