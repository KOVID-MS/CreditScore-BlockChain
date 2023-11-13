require("@nomiclabs/hardhat-waffle")
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    Sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/84dv_h45c2bkGhqEh9k_8vg3xfopqnBH",
      accounts: ["1e0f8ca4157034c886eb092f11239b5c39ce1e3816746e1febdaf90ffd1680fa"]
    }
  }
};