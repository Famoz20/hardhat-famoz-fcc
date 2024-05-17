// // import

// function deployFunc() {
//     console.log("Hi")
// }

// module.exports.default = deployFunc

// module.export = async (hre) => {
//     const { getNamedAccounts, deployments } = hre

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // if chainId is X use Y
    // if chainId is Z use A
    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // if the contract doesn't exist, we deploy a minimal version
    // for our local testing

    // hre.getNamesAccounts
    //hre.deployment
    // when going for local host or hardhat network we want to use mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [
            ethUsdPriceFeedAddress,
            /* address */
        ], // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("----------------------------------------")
}
module.exports.tags = ["all", "fundme"]
