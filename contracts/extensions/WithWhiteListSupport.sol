// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import '@openzeppelin/contracts/utils/structs/EnumerableMap.sol';

abstract contract WithWhiteListSupport {
    // Add the library methods
    using EnumerableSet for EnumerableSet.AddressSet;
    uint256 private _price;
    // Declare a set state variable
    EnumerableSet.AddressSet private _whiteList;
    event WhiteListPriceUpdated(uint256 newPrice, uint256 oldPrice);
    event WhiteListUpdated(address beneficiary);

    /// @dev to be override by the child contract to add access control modifier
    function _setWhiteListPrice(uint256 price_) internal virtual {
        require(price_ > 0, 'zero price is not allowed');
        emit WhiteListPriceUpdated(_price, price_);
        _price = price_;
    }

    /// @dev to be override by the child contract to add access control modifier
    function _setWhiteList(address[] memory _list) internal virtual {
        // require(whiteList.length()==0,"Already initialzed");
        // require(_list.length > 0, 'Empty list is not allowed');
        for (uint256 index = 0; index < _list.length; index++) {
            require(_list[index] != address(0), 'empty address is not allowed');
            require(!_whiteList.contains(_list[index]), 'duplicated address is not allowed');
            _whiteList.add(_list[index]);
            emit WhiteListUpdated(_list[index]);
        }
    }

    function isWhiteListed(address _beneficiary) public view returns (bool) {
        return _whiteList.contains(_beneficiary);
    }

    function whilteListPrice() public view returns (uint256) {
        return _price;
    }
}
