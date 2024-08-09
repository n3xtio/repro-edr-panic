// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// https://docs.openzeppelin.com/contracts/4.x/api/proxy#transparent-vs-uups

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract TOKENProxy is ERC1967Proxy {
    constructor(address _implementation, bytes memory _data) ERC1967Proxy(_implementation, _data) {}
}
