const { parseEther } = require('ethers/lib/utils')

// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, execute } = deployments
  const { deployer } = await getNamedAccounts()
  const name = 'AnyNFTPausableWithEth'
  const symbol = '8B'
  const baseURI = 'ipfs://QmVAjAt3otNNJEkEbkR2suki13BhnWZc4ohxG8BA3CLLQd/'
  const _maxSupply = 8888
  const maxToMintPerAddress_ = 20
  const reserved_ = 388
  const _startTimeSale = Date.now()
  const _wallets = ['0x2819C6d61e4c83bc53dD17D4aa00deDBe35894AA']
  const _mintPrice = parseEther((0.06).toString())
  const _revealTime = 60 // 1 munite
  const _owner = deployer
  
  await deploy('AnyNFTPausableWithEth', {
    from: deployer,
    args: [
      // name,
      // symbol,
      baseURI,
      _startTimeSale,
      _mintPrice,
      _maxSupply,
      maxToMintPerAddress_,
      _revealTime,
      reserved_,
      _wallets,
      _owner,
    ],
    log: true,
  })
  await execute('AnyNFTPausableWithEth', { from: deployer }, 'mintReservedNFTs', deployer, 5)
}
module.exports.tags = ['AnyNFTPausableWithEth']
