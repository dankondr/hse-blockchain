// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155UnfungibleToken is ERC1155 {
    mapping (uint256 => uint256) private _tokenPrices;

    // Define the event for token creation
    event TokenMinted(address indexed to, uint256 tokenId, uint256 tokenCount, uint256 price);

    // Define the mint function
    function mint(address to, uint256 tokenCount, uint256 price) public {
        require(msg.sender == address(this), "Only the contract owner can mint new tokens");

        uint256 tokenId = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, to)));
        _mint(to, tokenId, tokenCount, price);
        _tokenPrices[tokenId] = price;

        emit TokenMinted(to, tokenId, tokenCount, price);
    }

    function tokenPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenPrices[tokenId];
    }
}
