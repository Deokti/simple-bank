//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

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
    event Withdraw(address indexed _address, uint256 _amount);

    // **************************
    // View functions
    // **************************

    function balanceOf(address _address) public view returns (uint256) {
        return _balances[_address];
    }

    function approved(address _address) public view returns (bool) {
        return _approved[_address];
    }

    function lastWithdraw(address _address) public view returns (uint256) {
        return _lastWithdraw[_address];
    }

    function totalSupply() public view returns (uint256) {
        return address(this).balance;
    }

    // **************************
    // State modifying functions
    // **************************

    function approve(address _address) public returns (bool) {
        return _approve(_address);
    }

    function deposit(uint256 _amount) external payable {
        _deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) public {
        _withdraw(msg.sender, _amount);
    }

    receive() external payable {
        _deposit(msg.sender, msg.value);
    }

    // **************************
    // Internal functions
    // **************************

    function _approve(address _address) internal returns (bool) {
        require(_approved[_address] == false, "The address been approved");

        _approved[_address] = true;
        emit Approv(_address);
        return true;
    }

    function _deposit(address _address, uint256 _amount) internal {
        require(_approved[_address] == true, "This address has not confirmed");
        _balances[_address] = _balances[_address].add(_amount);
        emit Deposit(_address, _amount);
    }

    function _withdraw(address _address, uint256 _amount) internal {
        // Address approved
        require(_approved[_address] == true, "This address has not confirmed");

        // Checking the balance
        require(_balances[_address] >= _amount, "There are not enough ethers!");

        _balances[_address] = _balances[_address].sub(_amount);

        payable(_address).transfer(_amount);
        emit Withdraw(_address, _amount);
    }
}
