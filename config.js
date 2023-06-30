export const logo = "https://img.freepik.com/free-vector/flat-design-nft-concept_52683-62388.jpg?w=826&t=st=1687401734~exp=1687402334~hmac=2c187031162789603de57149f6b76d6f6c01b02dabed240129d0ff305c9c81bb";
export const nftAddress = "0xecb4a6dFEA267BBd8fEd3FB6172289c41ccB6BE0"
export const nftMarketAddress = "0xb947c3B03527B37f6510b3294890E940ffcf70f9"


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



