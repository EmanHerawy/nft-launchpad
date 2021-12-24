// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

abstract contract WithRoundsSupport {
    uint256 private _RoundCap;
    event RoundStarted(uint256 capAmount, uint256 totalCap);

    /**

    modifier isWithinCapLimit(uint256 _numberOfNFTs) override {
        require((tokenCount() + _numberOfNFTs) <= (roundCap() - _reserved), 'Purchase exceeds max supply');
        _;
    }

 */
    // modifier roundWithinCapLimit(uint256 roundCap_) virtual {
    //     // require((tokenCount() + roundCap_) <= (maxSupply() - _reserved), 'round cap exceeds max supply');
    //     _;
    // }

    function _addNewRound(uint256 cap_) internal {
        require(cap_ != 0, 'Zero Cap is not allowed');
        _RoundCap += cap_;
        emit RoundStarted(cap_, _RoundCap);
    }

    function roundCap() public view returns (uint256) {
        return _RoundCap;
    }
}
