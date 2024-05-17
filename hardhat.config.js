require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-solhint")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("dotenv").config()
require("@nomicfoundation/hardhat-verify")
require("hardhat-deploy")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMARKET_CAP_API_KEY = process.env.COINMARKET_CAP_API_KEY || "key"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmation: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            //accounts: [PRIVATE_KEY],
            chainId: 31337,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: "true",
        currency: "USD",
        coinmarketcap: COINMARKET_CAP_API_KEY,
        token: "MATIC",
    },
}
