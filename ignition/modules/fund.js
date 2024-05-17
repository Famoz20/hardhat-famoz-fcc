const { Contract } = require("ethers")
const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const FundMe = await ethers.getContractAt("FundMe", deployer)
    console.log("Funding Contract...")
    const transactionResponse = await FundMe.fund({
        value: ethers.parseEther("0.1"),
    })
    await transactionResponse.wait(1), console.log("Funded!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
