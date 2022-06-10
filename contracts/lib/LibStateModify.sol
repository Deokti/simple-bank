//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {LibAppStorage, AppStorage} from "./AppStorage.sol";

// Library encapsulates modify state
// Then used in SimpleBankModifyFacet
library LibStateModify {
    using SafeMath for uint256;

    event Approv(address indexed _address);
    event Deposit(address indexed _address, uint256 _amount);
    event Withdraw(address indexed _address, uint256 _amount);

    function approve(address _address) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();

        require(s._approved[_address] == false, "The address been approved");

        s._approved[_address] = true;
        emit Approv(_address);
    }

    function deposit(address _address, uint256 _amount) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();

        require(
            s._approved[_address] == true,
            "This address has not confirmed"
        );
        s._balances[_address] = s._balances[_address].add(_amount);
        console.log(_address);

        console.log(s._balances[_address]);
        emit Deposit(_address, _amount);
    }

    function withdraw(address _address, uint256 _amount) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();

        // Address approved
        require(
            s._approved[_address] == true,
            "This address has not confirmed"
        );

        // Checking the balance
        require(
            s._balances[_address] >= _amount,
            "There are not enough ethers!"
        );
        console.log("withdraw");
        console.log(_address);
        s._balances[_address] = s._balances[_address].sub(_amount);

        payable(_address).transfer(_amount);
        emit Withdraw(_address, _amount);
    }
}
