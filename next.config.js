/** @type {import('next').NextConfig} */
require('dotenv').config();
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['gateway.pinata.cloud','ipfs.infura.io'],
  },
  env: {
    API_KEY: process.env.API_KEY,
    GATE_WAY: process.env.GATE_WAY,
    ALCHEMY_POLYGON_API_KEY : process.env.ALCHEMY_POLYGON_API_KEY,
    privateKey : process.env.privateKey
  },

 
  
}/** @type {import('next').NextConfig} */
module.exports = nextConfig
