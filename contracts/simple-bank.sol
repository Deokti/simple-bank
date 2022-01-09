// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    // Structure one depositor
    struct Depositor {
        uint256 _amount; // 0
        bool _isRegister; // false
    }

    address owner;
    address public addressBank;
    mapping(address => Depositor) private depositors;
  
    constructor () {
        owner = msg.sender;
        addressBank = address(this);
    }

    /**
    * @dev Gets the balance of the specified address.
    * @param _owner The address to query the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(address _owner) public view returns (uint256) {
        return depositors[_owner]._amount;
    }

    /**
    * @dev Registers a user within a contract
    * @param _owner The address to query the registration.
    */
    function register (address _owner) public IsRegister("You are already registered", false) {
        depositors[_owner]._amount = 0;
        depositors[_owner]._isRegister = true;
    }

    /**
    * @dev Allows you to put some amount on yourself
    */
   function putInStorage () external payable IsRegister("You must register", true) {
        require(msg.value > 0, "You must put more than 0");
        depositors[msg.sender]._amount += msg.value;
   }

    /**
    * @dev Allows you to withdraw money from your account
    */
   function orderCash () external payable IsRegister("You must register", true) {
        require(balanceOf(msg.sender) > 0, "You have nothing to film");

        address payable receiver = payable(msg.sender);
        uint256 _balance = depositors[msg.sender]._amount;

        receiver.transfer(_balance);
        depositors[msg.sender]._amount = 0;
   }

    /**
    * @dev Works when sending money, for example from Metamask. 
    * @dev Allows you to put some amount on yourself. 
    */
   receive () external payable IsRegister("You must register", true) {
        require(msg.value > 0, "You must put more than 0");

        depositors[msg.sender]._amount += msg.value;
   }

   function isRegister () private view returns(bool) {
       return depositors[msg.sender]._isRegister;
   }

    modifier IsRegister (string memory message, bool compare) {
        require(isRegister() == compare, message);
        _;
    }
}

