// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ResumeNFT is ERC721, ERC721URIStorage, Ownable {
    // uint256 public nextTokenId;
    uint256 public nextTokenId = 1;

    struct Endorsement {
        address endorser;
        string message;
        uint256 timestamp;
    }

    mapping(uint256 => bytes32) public resumeHashes;
    mapping(uint256 => Endorsement[]) public endorsements;

    constructor() ERC721("ResumeNFT", "RESUME") Ownable() {}

    function mintResume(
        address to,
        string memory uri,
        bytes32 resumeHash
    ) public returns (uint256) {
        uint256 tokenId = nextTokenId;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        resumeHashes[tokenId] = resumeHash;
        nextTokenId++;
        return tokenId;
    }

    function endorseResume(uint256 tokenId, string memory message) public {
        require(_ownerOf(tokenId) != address(0), "Resume does not exist");
        require(
            msg.sender != ownerOf(tokenId),
            "You cannot endorse your own resume"
        );
        require(
            !_hasEndorsed(tokenId, msg.sender),
            "You have already endorsed this resume"
        );

        endorsements[tokenId].push(
            Endorsement({
                endorser: msg.sender,
                message: message,
                timestamp: block.timestamp
            })
        );
    }

    function getEndorsements(
        uint256 tokenId
    ) public view returns (Endorsement[] memory) {
        return endorsements[tokenId];
    }

    function verifyResume(
        uint256 tokenId,
        bytes32 hash
    ) public view returns (bool) {
        return resumeHashes[tokenId] == hash;
    }

    // Required override methods for 4.9.3
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _hasEndorsed(
        uint256 tokenId,
        address user
    ) internal view returns (bool) {
        Endorsement[] memory endorsers = endorsements[tokenId];
        for (uint256 i = 0; i < endorsers.length; i++) {
            if (endorsers[i].endorser == user) {
                return true;
            }
        }
        return false;
    }
}
