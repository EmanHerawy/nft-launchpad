const { parseEther } = require('ethers/lib/utils')

// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const AnyNFTPausableWithEth = await ethers.getContractFactory('AnyNFTPausableWithEth')
  let AnyNFTCreate2Deployer = await ethers.getContractFactory('AnyNFTCreate2Deployer')
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const baseURI = 'ipfs://QmVAjAt3otNNJEkEbkR2suki13BhnWZc4ohxG8BA3CLLQd/'
  const _maxSupply = 8888
  const maxToMintPerAddress_ = 20
  const reserved_ = 388
  const _startTimeSale = Date.now()
  const _wallets = ['0x2819C6d61e4c83bc53dD17D4aa00deDBe35894AA']
  const _mintPrice = parseEther(( 0.06).toString())
  const _revealTime = 60 // 1 munite
  const _owner = deployer
  const constructorArgs = [
    baseURI,
    _startTimeSale,
    _mintPrice,
    _maxSupply,
    maxToMintPerAddress_,
    _revealTime,
    reserved_,
    _wallets,
    _owner,
  ]

  

  const salt = 2021
  // 0x19550457F532A47f8B64e1246563e9013DF20260
  // let factoryAddress = "0x19550457F532A47f8B64e1246563e9013DF20260"; // if localhost , deploy first !
  let factoryAddress = 'Tp be added' // if localhost , deploy first !

  if (network.name == `hardhat` || network.name == `localhost`) {
    const factoryDeployed = await deploy('AnyNFTCreate2Deployer', {
      from: deployer,
      args: [],
      log: true,
    })
    factoryAddress = factoryDeployed.address

    console.log(factoryAddress, 'factoryAddress')
  }   
  const constructorTypes = [ 'string'  ,
    'uint256'  ,
    'uint256'  ,
    'uint256'  ,
    'uint256'  ,
    'uint256'  ,
    'uint256'  ,
    'address[]' ,
    'address' ]
  const constructor = encodeParam(constructorTypes, constructorArgs).slice(2)
  const bytecode = `${AnyNFTPausableWithEth.bytecode}${constructor}`
  // console.log(bytecode,'bytecode');
  // encodes parameter to pass as contract argument
  function encodeParam(dataType, data) {
    const abiCoder = ethers.utils.defaultAbiCoder
    return abiCoder.encode(dataType, data)
  }

  function buildCreate2Address(creatorAddress, saltHex, byteCode) {
    return `0x${ethers.utils
      .keccak256(
        `0x${['ff', creatorAddress, saltHex, ethers.utils.keccak256(byteCode)]
          .map((x) => x.replace(/0x/, ''))
          .join('')}`
      )
      .slice(-40)}`.toLowerCase()
  }

  // converts an int to uint256
  function numberToUint256(value) {
    const hex = value.toString(16)
    return `0x${'0'.repeat(64 - hex.length)}${hex}`
  }

  // returns true if contract is deployed on-chain
  async function isContract(address) {
    const code = await ethers.provider.getCode(address)
    return code.slice(2).length > 0
  }

  // First see if already deployed
  const computedAddr = buildCreate2Address(factoryAddress, numberToUint256(salt), bytecode)
  console.log(computedAddr, 'computedAddr')
  const isDeployed = await isContract(computedAddr)
  if (!isDeployed) {
    const factory = await AnyNFTCreate2Deployer.attach(factoryAddress)
    const result = await (await factory.deploy(bytecode, salt)).wait()
    //  const addr = result.events[0].args.addr.toLowerCase();
    console.log({ result })
    // console.log({addr});
  }

}

module.exports.tags = ['AnyNFTCreate2Deployer']
