require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const {API_URL_OPTIMISM, PRIVATE_KEY_OPTIMISM } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      //chainId: 31337
    },
    optimism: {
      url: API_URL_OPTIMISM,
      accounts: [PRIVATE_KEY_OPTIMISM],
    },
  },
};
