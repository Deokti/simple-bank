//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

import {AppStorage} from "../lib/AppStorage.sol";
import {LibStateModify} from "../lib/LibStateModify.sol";

// Contract call function for returns data
contract SimpleBankModifyFacet {
    AppStorage internal s;

    function approve(address _address) external returns (bool) {
        LibStateModify.approve(_address);
        return true;
    }

    function deposit(address _address, uint256 _amount) external {
        console.log("deposit");
        LibStateModify.deposit(_address, _amount);
    }

    function withdraw(address _address, uint256 _amount) external {
        console.log("_address");
        console.log(_address);
        LibStateModify.withdraw(_address, _amount);
    }

    function supportsInterface(bytes4 _interfaceID)
        external
        view
        returns (bool)
    {}
}
