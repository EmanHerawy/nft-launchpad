const { parseEther } = require('ethers/lib/utils')

// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, execute } = deployments
  const { deployer } = await getNamedAccounts()
 
  const baseURI = 'ipfs://QmY1DA4kK2B3B8pyTH5C7Gr8YqKomLKZyH8MY421wtGK9s/'
  const _maxSupply = 50
   const reserved_ = 10
  const _startTimeSale = 1638895394//Date.now()/100
  const _wallets = ['0x2819C6d61e4c83bc53dD17D4aa00deDBe35894AA',"0x4DECad41547aA81740Be6016ad402BA201Ec973b"]
  const _mintPrice = parseEther((0.06).toString())
  const _revealTime = 86400 // 1 day
  const _owner = deployer
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
  await execute('TheKingCollection', { from: deployer }, 'mintReservedNFTs', deployer, 5)
}
module.exports.tags = ['TheKingCollection']
