# VidalCrowdsale
a crowdsale for vidal's nfts where user can sell the nft at specific price 

# How it works?
## setup 
-  deploy with the pre-configured smart contract data ( start time, ax supply , wallets where money goes to , number of reserved nft which won't be for sale , token uri, owner address)
- owner  can update the sale start time only if the old starttime is not started 

## user activities 
- only after start time, user can buy nfts buy sending eth and the number of nft they want to mint
- Owner can mint nfts from the reserved nfts regardless the starttime
- owner can withdraw eth and the function will auo-calculate and split the eth between the wallets address 
