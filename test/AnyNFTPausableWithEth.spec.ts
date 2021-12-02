import chai, { expect } from "chai";
import { Contract, BigNumber } from "ethers";
// BigNumber.from
// import { bigNumberify, hexlify, keccak256, defaultAbiCoder, toUtf8Bytes } from 'ethers/utils'
import { solidity, MockProvider, deployContract } from "ethereum-waffle";

import ER721 from "../artifacts/contracts/launchpadProjects/erc721/VidalCrawdSale.sol/VidalCrawdSale.json";
import { parseEther } from "ethers/lib/utils";
chai.use(solidity);
const baseUri = "http://ipfs.io";
const name = 'VidalCrawdSale';
const symbol = 'Vidal';
let timestampBefore = 0;
const nftTestAmount = 4;
  const baseURI = 'ipfs://QmVAjAt3otNNJEkEbkR2suki13BhnWZc4ohxG8BA3CLLQd/'
  const _maxSupply = 8888
  const maxToMintPerAddress_ = 20
  const reserved_ = 388
  const _startTimeSale = 0//Date.now()
  const _wallets = ['0x2819C6d61e4c83bc53dD17D4aa00deDBe35894AA']
  const _mintPrice = parseEther((0.06).toString()).toString()
  const _revealTime = 60 // 1 munite
describe("AnyNFTPausableWithEth", () => {
  const provider = new MockProvider();
  const [wallet, other, user2] = provider.getWallets();
  let token: Contract;
  before(async () => {

    
    token = await deployContract(wallet, ER721, [
       // name,
      // symbol,
      baseURI,
      _startTimeSale,
      _mintPrice,
      _maxSupply,
      _revealTime,
      reserved_,
      _wallets,
      wallet.address,
    ]);
        console.log(     baseURI,
      _startTimeSale,
      _mintPrice,
      _maxSupply,
      maxToMintPerAddress_,
      _revealTime,
      reserved_,
      _wallets,
      wallet,"test");
  });

  it("name, symbol,  wallets,mintPrice,maxToMintPerAddress,maxSupply,reserved", async () => {
  
    const _name = await token.name();
    expect(_name).to.eq(name);
    expect(await token.symbol()).to.eq(symbol);
    // expect(await token.wallets()).to.eq(_wallets);
    // expect(await token.mintPrice()).to.eq(0.06 * 10 ** 18);
    expect(await token.maxToMintPerAddress()).to.eq(20);
    expect(await token.maxSupply()).to.eq(8888);
    expect(await token.reserved()).to.eq(388);
  });

  it("Should not mint if the sale is not started", async () => {
    console.log(nftTestAmount*  +_mintPrice, _mintPrice,'nftTestAmount*  +_mintPrice');
    console.log(parseEther((nftTestAmount*  +_mintPrice).toString()),'parseEther((nftTestAmount*  +_mintPrice).toString())');
    
    await expect(
      token.mint(nftTestAmount, {
        value: parseEther((nftTestAmount*  +_mintPrice).toString()),
      })
    ).to.revertedWith("Sale did not start yet");
  });
  it("Non OWner Should not update sale start time", async () => {
    await expect(
      token.connect(other).updateSaleStartTime(Date.now())
    ).to.revertedWith("Ownable: caller is not the owner");
  });
  it(" OWner can update sale start time", async () => {
    const blockNumBefore = await provider.getBlockNumber();
    const blockBefore = await provider.getBlock(blockNumBefore);
    timestampBefore = blockBefore.timestamp;
    await token.connect(wallet).updateSaleStartTime(timestampBefore + 10);
    await expect(await token.startTimeSale()).to.eql(
      BigNumber.from(timestampBefore + 10)
    );
    await provider.send("evm_increaseTime", [timestampBefore + 100]);
    await provider.send("evm_mine", []);
  });
  it("Non OWner Should not call mintreservedNFTs", async () => {
    await expect(
      token.connect(other).mintReservedNFTs(wallet.address, 2)
    ).to.revertedWith("Ownable: caller is not the owner");
  });
  it(" OWner can mint reserved nft mintreservedNFTs", async () => {
    await expect(
      await token
        .connect(wallet)
        .mintReservedNFTs(user2.address, nftTestAmount)
    ).to.emit(token, "Transfer");

    await expect(await token.balanceOf(user2.address)).to.eql(
      BigNumber.from(nftTestAmount)
    );
    await expect(await token.totalReserveSupply()).to.eql(
      BigNumber.from(nftTestAmount)
    );
  });

  it("Should not mint if the price is less than the minPrice", async () => {
    await expect(
      token.mint(nftTestAmount, { value: parseEther("0.03") })
    ).to.revertedWith("ETH value not correct");
  });
  it("Should not mint more than 20 nft", async () => {
    await expect(
      token.mint(25, { value: parseEther((25 * 0.06).toString()) })
    ).to.revertedWith("You requested too many NFTs");
  });
  it("Should  mint", async () => {
    await expect(
      await token.connect(other).mint(nftTestAmount, {
        value: (nftTestAmount*  +_mintPrice).toString(),
      })
    ).to.emit(token, "Transfer");
    await expect(await token.balanceOf(other.address)).to.eql(
      BigNumber.from(nftTestAmount)
    );
    // const eventFilter = await token.filters.Transfer(null, null);
    // const events = await token.queryFilter(eventFilter);
    // console.log({ events });

    // const tokenId = (events[events.length - 1] as any).args[2].toNumber();
    // const to = (events[events.length - 1] as any).args[1];
    // console.log(other.address);

    // console.log({ tokenId, to });
  });

  it("transferFrom", async () => {
    const NFTs = await token.ownerNFTs(other.address);
    await expect(
      token.connect(other).transferFrom(other.address, wallet.address, NFTs[1])
    )
      .to.emit(token, "Transfer")
      .withArgs(other.address, wallet.address, NFTs[1]);
    expect(await token.balanceOf(wallet.address)).to.eq(BigNumber.from(1));
    expect(await token.balanceOf(other.address)).to.eq(BigNumber.from(nftTestAmount-1));
  });
  it("transferFrom::fail", async () => {
    await expect(token.transferFrom(wallet.address, other.address, 1)).to.be
      .reverted;
  });
  it(" Should not reveal token URI before time", async () => {
    const NFTs = await token.ownerNFTs(other.address);

    await expect(token.tokenURI(NFTs[1])).to.revertedWith(
      "ERC721URIStorage: URI query for non revealed token"
    );
  });
  it(" Should  reveal token URI after time", async () => {
    const NFTs = await token.ownerNFTs(other.address);
    await provider.send("evm_increaseTime", [
      timestampBefore + 24 * 60 * 60 * 60,
    ]);
    await provider.send("evm_mine", []);
    await expect(token.tokenURI(NFTs[1])).to.not.be.reverted;
  });
  it("Non OWner Should not call withdraw", async () => {
    await expect(token.connect(other).withdraw()).to.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
  it(" OWner can withdraw", async () => {
    await expect(await token.connect(wallet).withdraw())
      .to.emit(token, "Withdrawn")
    //   .withArgs(_wallets[0], parseEther((4 * 0.06).toString()));
    // await expect(await provider.getBalance(_wallets[0])).to.eql(
    //   parseEther((4 * 0.06).toString())
    // );
    // // await expect(await provider.getBalance(wallet2)).to.eql(
    //   parseEther((4 * 0.06).toString())
    // );
  });
});
/**"ipfs://QmVAjAt3otNNJEkEbkR2suki13BhnWZc4ohxG8BA3CLLQd/","60000000000000000","8888","86400","388",["0x2819C6d61e4c83bc53dD17D4aa00deDBe35894AA","0x4DECad41547aA81740Be6016ad402BA201Ec973b"],"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4" */