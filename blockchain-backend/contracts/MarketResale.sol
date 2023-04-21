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
        nft = ERC721Enumerable(_nft);
    }

    function listSale(
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(nft.ownerOf(tokenId) == msg.sender, "you are not the owner");
        require(vaultItems[tokenId].tokenId == 0, "Token already listed");
        require(price > 0, "Price must be greater than 0");
        require(msg.value == listingFee, "Please pay the listing fee");

        _itemsIds.increment();
        uint256 itemId = _itemsIds.current();

        vaultItems[itemId] = List(
            itemId,
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );
        nft.transferFrom(msg.sender, address(this), tokenId);

        emit NFTListCreated(
            itemId,
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    //Todo: Now gonna deal with the buyer
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        List storage myNFT = vaultItems[tokenId];
        uint256 price = myNFT.price;
        uint256 
        require(msg.value == price, "Pay the correct price");

        myNFT.seller.transfer(msg.value);

        nft.transferFrom(address(this), msg.sender, tokenId);

        myNFT.sold = true;

        delete vaultItems[tokenId];
    }
}
