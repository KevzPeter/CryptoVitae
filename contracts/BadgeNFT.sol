// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BadgeNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    mapping(address => bool) public isWhitelistedOrg;
    mapping(uint256 => address) public badgeIssuer;

    event BadgeIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string badgeType,
        address indexed issuedBy
    );

    constructor() ERC721("DecentID Badge", "DIDB") {}

    modifier onlyOrg() {
        require(
            isWhitelistedOrg[msg.sender],
            "Not authorized: must be a whitelisted org"
        );
        _;
    }

    function whitelistOrg(address org, bool approved) external onlyOwner {
        isWhitelistedOrg[org] = approved;
    }

    function mintBadge(
        address to,
        string memory badgeType,
        string memory tokenURI
    ) external onlyOrg returns (uint256) {
        uint256 tokenId = nextTokenId;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nextTokenId++;
        badgeIssuer[tokenId] = msg.sender;
        emit BadgeIssued(tokenId, to, badgeType, msg.sender);
        return tokenId;
    }

    function getOrgStatus(address org) external view returns (bool) {
        return isWhitelistedOrg[org];
    }
}
