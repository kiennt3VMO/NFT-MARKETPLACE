require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers")
require('dotenv').config();
// const fs = require("@nomicfoundation/fs");
// const privateKey = fs.readFileSync(".secret").toString();

/** @type import('hardhat/config').HardhatUserConfig */
const ALCHEMY_POLYGON_API_KEY = "9gd2hZXDxdArvE90PAizgM0Wpf5rm7NI";
const privateKey1 = "e88b60a5c2b73fa5eaaa4c6664a833611b5055d0045c7c1de4894906252cf9ee";
module.exports = {
  solidity: "0.8.18",
  etherscan: {
    apiKey: "8PZUZCGI3QRRDBFJB8CM3YBYJTZ8MPN5BP",
  },
  networks: {
    hardhat :{
      chainId:1337
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_POLYGON_API_KEY}`,
      accounts: [privateKey1],
    }
  }

};