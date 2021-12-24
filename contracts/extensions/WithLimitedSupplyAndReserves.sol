// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './WithLimitedSupply.sol';

/// @author Startfi team:  Eman Herawy
/// @title A token tracker that limits the token supply and increments token IDs on each new mint and reseve certain amount outside the sale
abstract contract WithLimitedSupplyAndReserves is WithLimitedSupply {
    uint256 internal _totalReserveSupply;

    uint256 private immutable _reserved;

    modifier isWithinCapLimit(uint256 _numberOfNFTs) virtual override {
        require((tokenCount() + _numberOfNFTs) <= (maxSupply() - _reserved), 'Purchase exceeds max supply');
        _;
    }
    modifier isWithinReserveCapLimit(uint256 _numberOfNFTs) {
        require((_totalReserveSupply + _numberOfNFTs) <= _reserved, 'Exceeds max reserved allowed');
        _;
    }

    /// Instanciate the contract
    /// @param totalSupply_ how many tokens this collection should hold
    /// @param reserved_ how many tokens this collection should reserved by the team
    constructor(uint256 totalSupply_, uint256 reserved_) WithLimitedSupply(totalSupply_) {
        _reserved = reserved_;
    }

    /// @dev Get reserved amount
    /// @return the token amount reserved
    function reserved() public view returns (uint256) {
        return _reserved;
    }

    function totalReserveSupply() external view returns (uint256) {
        return _totalReserveSupply;
    }

    /// @dev Check whether tokens are still available for sale
    /// @return the available token count
    function availableTokenForSale() external view returns (uint256) {
        return (maxSupply() - _reserved) - (tokenCount() - _totalReserveSupply);
    }

    function _addToTotalReserveSupply(uint256 _numberOfNFTs) internal {
        _totalReserveSupply += _numberOfNFTs;
    }
}
