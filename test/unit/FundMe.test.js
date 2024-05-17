const { deployments, ethers, getNamedAccounts } = require("hardhat") // runtime environment..
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.parseEther("1") // 1 ETH

          beforeEach(async function () {
              deployer = await ethers.provider.getSigner()
              await deployments.fixture(["all"])
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  (
                      await deployments.get("FundMe")
                  ).address,
                  deployer
              )
              mockV3Aggregator = await ethers.getContractAt(
                  "MockV3Aggregator",
                  (
                      await deployments.get("MockV3Aggregator")
                  ).address,
                  deployer
              )
          })

          describe("constructor", async function () {
              it("sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, await mockV3Aggregator.getAddress())
              })
          })

          describe("fund", async function () {
              it("it fails if you don't send enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })
              it("updated the amount funded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to array of getFunders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer.address)
              })
          })
          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraws ETH from a single funder", async () => {
                  const fundMeAddress = await fundMe.getAddress()
                  const provider = fundMe.runner?.provider
                  // before deployer balances
                  const FundMeBalance = await provider.getBalance(fundMeAddress)
                  const startingDeployerBalance = await provider.getBalance(
                      deployer
                  )

                  // withdraw
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt =
                      (await transactionResponse.wait()) || {
                          gasUsed: BigInt(0),
                          gasPrice: BigInt(0),
                      }
                  const { gasUsed, gasPrice } = transactionReceipt
                  const gasCost = gasUsed * gasPrice

                  // after
                  const endingDeployerBalance = await provider.getBalance(
                      deployer
                  )

                  assert.equal(
                      (FundMeBalance + startingDeployerBalance).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
              }),
                  it("allow withdraw with multiple funder", async () => {
                      const accounts = await ethers.getSigners()
                      for (i = 1; i < 6; i++) {
                          const fundMeConnectedContract = await fundMe.connect(
                              accounts[i]
                          )
                          await fundMeConnectedContract.fund({
                              value: sendValue,
                          })
                      }

                      const fundMeAddress = await fundMe.getAddress()
                      const provider = fundMe.runner?.provider
                      // before deployer balances
                      const FundMeBalance = await provider.getBalance(
                          fundMeAddress
                      )
                      const startingDeployerBalance = await provider.getBalance(
                          deployer
                      )

                      // withdraw
                      const transactionResponse = await fundMe.withdraw()
                      const transactionReceipt =
                          (await transactionResponse.wait()) || {
                              gasUsed: BigInt(0),
                              gasPrice: BigInt(0),
                          }
                      const { gasUsed, gasPrice } = transactionReceipt
                      const gasCost = gasUsed * gasPrice

                      // after
                      const endingDeployerBalance = await provider.getBalance(
                          deployer
                      )

                      assert.equal(
                          (FundMeBalance + startingDeployerBalance).toString(),
                          (endingDeployerBalance + gasCost).toString()
                      )

                      // Make a getter for storage variables
                      await expect(fundMe.getFunder(0)).to.be.reverted

                      for (i = 1; i < 6; i++) {
                          assert.equal(
                              await fundMe.getAddressToAmountFunded(
                                  accounts[i].address
                              ),
                              0
                          )
                      }
                  }),
                  it("CheaperWithdraw from single balance", async () => {
                      const fundMeAddress = await fundMe.getAddress()
                      const provider = fundMe.runner?.provider
                      // before deployer balances
                      const FundMeBalance = await provider.getBalance(
                          fundMeAddress
                      )
                      const startingDeployerBalance = await provider.getBalance(
                          deployer
                      )

                      // withdraw
                      const transactionResponse = await fundMe.cheaperWithdraw()
                      const transactionReceipt =
                          (await transactionResponse.wait()) || {
                              gasUsed: BigInt(0),
                              gasPrice: BigInt(0),
                          }
                      const { gasUsed, gasPrice } = transactionReceipt
                      const gasCost = gasUsed * gasPrice

                      // after
                      const endingDeployerBalance = await provider.getBalance(
                          deployer
                      )

                      assert.equal(
                          (FundMeBalance + startingDeployerBalance).toString(),
                          (endingDeployerBalance + gasCost).toString()
                      )
                  }),
                  async () => {
                      const accounts = await ethers.getSigners()
                      for (i = 1; i < 6; i++) {
                          const fundMeConnectedContract = await fundMe.connect(
                              accounts[i]
                          )
                          await fundMeConnectedContract.fund({
                              value: sendValue,
                          })
                      }

                      const fundMeAddress = await fundMe.getAddress()
                      const provider = fundMe.runner?.provider
                      // before deployer balances
                      const FundMeBalance = await provider.getBalance(
                          fundMeAddress
                      )
                      const startingDeployerBalance = await provider.getBalance(
                          deployer
                      )

                      // withdraw
                      const transactionResponse = await fundMe.cheaperWithdraw()
                      const transactionReceipt =
                          (await transactionResponse.wait()) || {
                              gasUsed: BigInt(0),
                              gasPrice: BigInt(0),
                          }
                      const { gasUsed, gasPrice } = transactionReceipt
                      const gasCost = gasUsed * gasPrice

                      // after
                      const endingDeployerBalance = await provider.getBalance(
                          deployer
                      )

                      assert.equal(
                          (FundMeBalance + startingDeployerBalance).toString(),
                          (endingDeployerBalance + gasCost).toString()
                      )

                      // Make a getter for storage variables
                      await expect(fundMe.getFunder(0)).to.be.reverted

                      for (i = 1; i < 6; i++) {
                          assert.equal(
                              await fundMe.getAddressToAmountFunded(
                                  accounts[i].address
                              ),
                              0
                          )
                      }
                  },
                  it("Only allows the owner to withdraw", async () => {
                      const accounts = await ethers.getSigners()
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[1]
                      )
                      await expect(
                          fundMeConnectedContract.withdraw()
                      ).to.be.revertedWithCustomError(
                          fundMeConnectedContract,
                          "FundMe__NotOwner"
                      )
                  })
          })
      })
