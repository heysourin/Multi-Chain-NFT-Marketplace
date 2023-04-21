// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketResell is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemsIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listingFee = 0.001 ether;

    struct List {
        uint256 itemId;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => List) public vaultItems;

    event NFTListCreated(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );
    ERC721Enumerable nft; //creating instance of our token contract

    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    constructor(ERC721Enumerable _nft) {
        owner = payable(msg.sender);
        nft = _nft;
    }

    function listSale(
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(nft.ownerOf(tokenId) == msg.sender,"you are not the owner");
    }
}
