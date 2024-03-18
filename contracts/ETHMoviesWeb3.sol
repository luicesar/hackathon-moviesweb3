// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHMoviesWeb3 is ERC721 {

    uint256 public maxSupply;
    uint256 public totalSupply;
    address public owner;

    struct Movie {
        string name;
        uint256 cost;
        bool isOwned;
        string voteAverage;
        string image;
    }
    
    mapping(uint256 => Movie) movies;

    modifier onlyOwner(){
      require(msg.sender == owner, "only the owner can withdraw");
      _;
    }

    constructor(string memory _name, string memory _symbol) 
        ERC721(_name, _symbol)
    {
        owner = msg.sender;
    }

    //Set in List a movie
    function list(string memory _name, uint256 _cost, string memory _voteAverage, string memory _image) public onlyOwner {
        maxSupply++;
        movies[maxSupply] = Movie(_name, _cost, false, _voteAverage, _image);
    }

    //mining
    function mint(uint256 _id) public payable {
        require(_id != 0);
        require(_id <= maxSupply);
        require(movies[_id].isOwned == false);
        require(msg.value >= movies[_id].cost);

        movies[_id].isOwned = true;
        totalSupply++;

        //ERC721: Safely mints `tokenId` and transfers it to `to`
        _safeMint(msg.sender, _id);
    }

    function getMovie(uint256 _id) public view returns(Movie memory){
        return movies[_id];
    }

    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

}
