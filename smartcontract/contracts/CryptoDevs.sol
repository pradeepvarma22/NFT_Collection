// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhiteList.sol";

contract CryptoDevs is ERC721Enumerable,Ownable
{
    string baseTokenURI;
    IWhiteList whitelist;
    bool public presaleStarted;
    uint256 public presaleEnded;
    uint256 public maxTokenIds=20;                  // max no of tokenIds
    uint256 public tokenIds;                        // total no of ids minted till now

    uint256 public _price = 0.01 ether;
    bool public _paused;

    modifier onlyWhenPaused() {
        require(!_paused,"Contract currently paused");
        _;
    }


    constructor(string memory baseURI_, address _whitelistContract) ERC721("KAD NFTs","KAD")
    {
        baseTokenURI =  baseURI_;
        whitelist = IWhiteList(_whitelistContract);
    }

    function startPresale() public onlyOwner
    {

        presaleStarted=true;
        presaleEnded = block.timestamp + 5 minutes;
    }
 
    function presaleMint() public payable onlyWhenPaused() {
        require(presaleStarted && block.timestamp < presaleEnded , "Presale Ended");
        require(whitelist.whiteListedAccounts(msg.sender), "You Are Not in whitelist");
        require(tokenIds < maxTokenIds , "Exceeded the limit");
        require( msg.value >= _price, "Ether Sent is not correct");
        tokenIds+=1;
        _safeMint(msg.sender, tokenIds);
    }

    function mint() public payable onlyWhenPaused()
    {

        require(presaleStarted && block.timestamp >= presaleEnded,"Presale not yet ended");
        require(tokenIds < maxTokenIds, "Exceeded the limit");
        require( msg.value >= _price, "Ether Sent is not correct");
        tokenIds+=1;
        _safeMint(msg.sender, tokenIds);
    }

    function _baseURI() internal view override virtual returns (string memory) {
        return baseTokenURI;
    }


    function withdraw() public onlyOwner {
        address _owner =   owner();
        uint256 amount  = address(this).balance;
        (bool sent,) =_owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }


    receive() external payable {}

    fallback() external payable {}


}