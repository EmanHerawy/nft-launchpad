const { parseEther } = require('ethers/lib/utils')

// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, execute } = deployments
  const { deployer } = await getNamedAccounts()

  const baseURI = 'ipfs://QmY1DA4kK2B3B8pyTH5C7Gr8YqKomLKZyH8MY421wtGK9s/'
  const _maxSupply = 2500
  const reserved_ = 100
  const _startTimeSale = 1639461600 //Date.now()/100
  const _wallets = ['0xac701BB1557F6c06070Bc114Ca6Ace4a358D3A84']
  const _mintPrice = parseEther((0.1).toString())
  const _revealTime = 120 //86400 * 7 //2 // 1 day
  const _owner =  "0xac701BB1557F6c06070Bc114Ca6Ace4a358D3A84"
  await deploy('TheKingCollection', {
    from: deployer,
    args: [
      // name,
      // symbol,
      baseURI,
      _startTimeSale,
      _mintPrice,
      _maxSupply,
      // maxToMintPerAddress_,
      _revealTime,
      reserved_,
      _wallets,
      _owner,
    ],
    log: true,
  })
 // await execute('TheKingCollection', { from: deployer }, 'mintReservedNFTs', deployer, 5)
}
module.exports.tags = ['TheKingCollection']
