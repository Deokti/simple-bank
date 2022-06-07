//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SimpleBank {
    using SafeMath for uint256;

    mapping(address => bool) private _approved;
    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _lastWithdraw;

    // **************************
    // Events
    // **************************
    event Approv(address indexed _address);
    event Deposit(address indexed _address, uint256 _amount);
    event Withdraw(address indexed _address, int256 _amount);

    // **************************
    // View functions
    // **************************
    function balanceOf(address _address) external view returns (uint256) {
        return _balances[_address];
    }

    function approved(address _address) external view returns (bool) {
        return _approved[_address];
    }

    function lastWithdraw(address _address) external view returns (uint256) {
        return _lastWithdraw[_address];
    }

    // **************************
    // State modifying functions
    // **************************
    function approve(address _address) external returns (bool) {
        require(_approved[_address] == false, "The address been approved");

        _approved[_address] = true;
        emit Approv(_address);
        return true;
    }

    function deposit(address _address, uint256 _amount) external payable {
        require(_approved[_address] == true, "This address has not confirmed");

        _balances[_address] += _balances[_address].add(_amount);
        emit Deposit(_address, _amount);
    }

    function withdraw(uint256 _amount) external {
        require(
            _approved[msg.sender] == true,
            "This address has not confirmed"
        );

        console.log(_balances[msg.sender], _amount);
        // !! Avoid to make time-based decisions in your business logic !!
        require(block.timestamp >= _lastWithdraw[msg.sender] + 1 weeks, "");

        // 2. checking the balance
        require(
            _balances[msg.sender] >= _amount,
            "Attempt to withdraw more than the account!"
        );

        _balances[msg.sender] = _balances[msg.sender].sub(_amount);
        _lastWithdraw[msg.sender] = block.timestamp;
    }
}
