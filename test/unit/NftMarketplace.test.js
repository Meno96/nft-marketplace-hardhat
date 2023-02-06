const { expect, assert } = require("chai")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Nft Marketplace Unit Test", function () {
          let nftMarketplace, nftMarketplaceContract, basicNft, basicNftContract
          const PRICE = ethers.utils.parseEther("0.1")
          const TOKEN_ID = 0

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplaceContract = await ethers.getContract("NftMarketplace")
              nftMarketplace = nftMarketplaceContract.connect(deployer)
              basicNftContract = await ethers.getContract("BasicNft")
              basicNft = await basicNftContract.connect(deployer)
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID)
          })

          describe("listItem", function () {
              it("Emits an event after listing an item", async () => {
                  expect(await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.emit(
                      "ItemListed"
                  )
              })

              it("Exclusively items that haven't been listed", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)

                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("AlreadyListed")
              })

              it("Exclusively allows owners to list", async () => {
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await basicNft.approve(user.address, TOKEN_ID)
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NotOwner")
              })

              it("Revert if price <= 0", async () => {
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, 0)
                  ).to.be.revertedWith("PriceMustBeAboveZero")
              })

              it("Needs approval to list items", async () => {
                  await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NotApprovedForMarketplace")
              })

              it("Updates listing with seller and price", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  listing = await nftMarketplace.getListing(basicNft.address, 0)
                  assert.equal(listing.price.toString(), PRICE)
                  assert.equal(listing.seller.toString(), deployer.address)
              })
          })

          describe("cancelListing", function () {
              it("Exclusively items that have been listed", async () => {
                  await expect(
                      nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NotListed")
              })

              it("Reverts if anyone but the owner tries to call", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  nftMarketplace = nftMarketplace.connect(user)
                  await expect(
                      nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NotOwner")
              })

              it("Emits event and removes listing", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  expect(await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)).to.emit(
                      "ItemCanceled"
                  )
                  await expect(
                      nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NotListed")
              })
          })

          describe("buyItem", function () {
              it("Reverts if the item isn't listed", async () => {
                  await expect(
                      nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NotListed")
              })

              it("Reverts if the price isn't met", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  await expect(
                      nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("PriceNotMet")
              })

              it("Transfers the nft to the buyer and updates internal proceeds record", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  nftMarketplace = nftMarketplace.connect(user)
                  expect(
                      await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
                  ).to.emit("ItemBought")
                  const newOwner = await basicNft.ownerOf(TOKEN_ID)
                  const deployerProceeds = await nftMarketplace.getProceeds(deployer.address)
                  assert(newOwner.toString() == user.address)
                  assert(deployerProceeds.toString() == PRICE.toString())
              })
          })

          describe("updateListing", function () {
              it("Must be owner and listed", async () => {
                  await expect(
                      nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NotListed")
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await expect(
                      nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NotOwner")
              })
              it("Price must be above zero", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  await expect(
                      nftMarketplace.updateListing(basicNft.address, TOKEN_ID, 0)
                  ).to.be.revertedWith("PriceMustBeAboveZero")
              })
              it("Updates the price of the item", async () => {
                  const updatedPrice = ethers.utils.parseEther("0.2")
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  expect(
                      await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, updatedPrice)
                  ).to.emit("ItemListed")
                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                  assert(listing.price.toString() == updatedPrice.toString())
              })
          })

          describe("withdrawProceeds", function () {
              it("Doesn't allow 0 proceed withdrawls", async () => {
                  await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith("NoProceeds")
              })

              it("Withdraws proceeds", async () => {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
                  nftMarketplace = nftMarketplaceContract.connect(deployer)

                  const deployerProceedsBefore = await nftMarketplace.getProceeds(deployer.address)
                  const deployerBalanceBefore = await deployer.getBalance()
                  const txResponse = await nftMarketplace.withdrawProceeds()
                  const transactionReceipt = await txResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const deployerBalanceAfter = await deployer.getBalance()

                  assert(
                      deployerBalanceAfter.add(gasCost).toString() ==
                          deployerProceedsBefore.add(deployerBalanceBefore).toString()
                  )
              })
          })
      })
