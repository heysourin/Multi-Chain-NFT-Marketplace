// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketResell is IERC721Receiver, ReentrancyGuard, Ownable {
    address payable holder;
    uint256 listingFee = 0.001 ether;

    struct List {
        uint256 tokenId;
        address payable seller;
        address payable holder;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => List) public vaultItems;

    event NFTListCreated(
        uint256 indexed tokenId,
        address seller,
        address holder,
        uint256 price,
        bool sold
    );

    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    ERC721Enumerable nft; //creating instance of our token contract

    constructor(ERC721Enumerable _nft) {
        holder = payable(msg.sender);
        nft = _nft;
    }

    function listSale(
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(nft.ownerOf(tokenId) == msg.sender, "you are not the holder");
        require(vaultItems[tokenId].tokenId == 0, "Token already listed");
        require(price > 0, "Price must be greater than 0");
        require(msg.value == listingFee, "Please pay the listing fee");

        vaultItems[tokenId] = List(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );
        nft.transferFrom(msg.sender, address(this), tokenId);

        emit NFTListCreated(tokenId, msg.sender, address(this), price, false);
    }

    //Todo: Now gonna deal with the buyer
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        List storage myNFT = vaultItems[tokenId];
        uint256 price = myNFT.price;

        require(msg.value == price, "Pay the correct price");

        myNFT.seller.transfer(msg.value);

        nft.transferFrom(address(this), msg.sender, tokenId);

        myNFT.sold = true;

        delete vaultItems[tokenId];
    }

    function cancelSale(uint256 tokenId) public nonReentrant {
        require(vaultItems[tokenId].seller == msg.sender, "NFT not yours");

        nft.transferFrom(address(this), msg.sender, tokenId);

        delete vaultItems[tokenId];
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        uint256 price = vaultItems[tokenId].price;
        return price;
    }

    function nftListings() public view returns (List[] memory) {
        uint256 nftCount = nft.totalSupply();
        uint256 currentIndex = 0;

        List[] memory items = new List[](nftCount);

        for (uint256 i = 0; i < nftCount; i++) {
            if (vaultItems[i + 1].holder == address(this)) {
                uint256 currentId = i + 1;
                List storage currentItem = vaultItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
            return items;
        }
    }

    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        require(from == address(0x0), "Cannot send nfts to Vault directly");
        return IERC721Receiver.onERC721Received.selector;
    }

    function withdraw() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }
}
