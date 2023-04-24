// SPDX-License-Identifier:MIT
pragma solidity 0.8.9;

contract Hello {
    string public name = "Ryle";

    function seeName() public view returns (string memory) {
        return name;
    }
}
