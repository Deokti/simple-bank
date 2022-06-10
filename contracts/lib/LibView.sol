//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import {LibAppStorage, AppStorage} from "./AppStorage.sol";

// Library encapsulates getting data
// Then used in SimpleBankViewFacet
library LibView {
    function balanceOf(address _address) internal view returns (uint256) {
        // Get data from general state and modify it
        AppStorage storage s = LibAppStorage.diamondStorage();
        console.log("222");
        console.log(_address);
        return s._balances[_address];
    }

    function approved(address _address) internal view returns (bool) {
        // Get data from general state and return _approved
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s._approved[_address];
    }

    function totalSupply() internal view returns (uint256) {
        return address(this).balance;
    }
}
