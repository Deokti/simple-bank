//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

struct AppStorage {
    mapping(address => bool) _approved;
    mapping(address => uint256) _balances;
    mapping(address => uint256) _lastWithdraw;
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        assembly {
            ds.slot := 0
        }
    }

    function abs(int256 x) internal pure returns (uint256) {
        return uint256(x >= 0 ? x : -x);
    }
}

// contract LibAppStorage {
//     // State for using Contract Bank
//     mapping(address => bool) private _approved;
//     mapping(address => uint256) private _balances;
//     mapping(address => uint256) private _lastWithdraw;
// }
