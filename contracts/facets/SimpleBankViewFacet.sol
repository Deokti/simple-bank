//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {AppStorage} from "../lib/AppStorage.sol";
import {LibView} from "../lib/LibView.sol";

// Contract call function for returns data
contract SimpleBankViewFacet {
    AppStorage internal s;

    function balanceOf(address _address) external view returns (uint256) {
        return LibView.balanceOf(_address);
    }

    function approved(address _address) external view returns (bool) {
        return LibView.approved(_address);
    }

    function totalSupply() external view returns (uint256) {
        return LibView.totalSupply();
    }
}
