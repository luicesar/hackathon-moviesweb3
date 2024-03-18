const { expect } = require("chai")
const { ethers } = require("hardhat")
const { describe } = require("mocha")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("ETHMoviesWeb3",  () => {
  let ethMoviesWeb3;
  let deployer, owner1;
  const NAME = 'ETH Movies Web3'
  const SYMBOL = 'ETHMW3'
  const VOTEAVERAGE = "1.1"
  const IMAGE = "IMAGE"

  beforeEach(async ()=> {
    //Setup accounts
    [deployer, owner1] = await ethers.getSigners();

    //Deploy contract
    const ETHMoviesWeb3 = await ethers.getContractFactory('ETHMoviesWeb3')
    ethMoviesWeb3 = await ETHMoviesWeb3.deploy('ETH Movies Web3','ETHMW3')

    //Set List a movie
    const transaction = await ethMoviesWeb3.connect(deployer).list("The ShaThe Shawshank Redemption", tokens(10),VOTEAVERAGE, IMAGE)
    await transaction.wait()
  })

  describe('Deployment',()=>{
    it('has a name', async ()=> {
      const result = await ethMoviesWeb3.name()
      expect(result).to.equal(NAME)
    })
  
    it('has a symbol', async ()=> {
      const result = await ethMoviesWeb3.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it('Sets the owner', async ()=> {
      const result = await ethMoviesWeb3.owner()
      expect(result).to.equal(deployer.address)
    })

    it("Returns the max supply", async () => {
      const result = await ethMoviesWeb3.maxSupply()
      expect(result).to.equal(1)
    })

    it("Returns the total supply", async () => {
      const result = await ethMoviesWeb3.totalSupply()
      expect(result).to.equal(0)
    })

  })

  describe('Movie',()=>{
    it('Returns movie attributes', async ()=> {
      const movie = await ethMoviesWeb3.getMovie(1);
      expect(movie.name).to.be.equal("The ShaThe Shawshank Redemption")
      expect(movie.cost).to.be.equal(tokens(10))
      expect(movie.isOwned).to.be.equal(false)
      expect(movie.voteAverage).to.be.equal("1.1")
      expect(movie.image).to.be.equal("IMAGE")
    })
  })

  describe('Minting',()=>{
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10","ether")
    
    beforeEach(async ()=> {
      const transaction = await ethMoviesWeb3.connect(owner1).mint(ID, {value: AMOUNT})
      await transaction.wait()
    });

    it('Updates the owner', async ()=> {
      const owner = await ethMoviesWeb3.ownerOf(ID);
      expect(owner).to.be.equal(owner1.address)
    })

    it('Updates the movie status', async ()=> {
      const movie = await ethMoviesWeb3.getMovie(ID)
      expect(movie.isOwned).to.be.equal(true)
    })

    it('Updates the contract balance', async ()=> {
      const result = await ethMoviesWeb3.getBalance();
      expect(result).to.be.equal(AMOUNT)
    })
  })

  describe("Withdrawing", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await ethMoviesWeb3.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait()

      transaction = await ethMoviesWeb3.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethMoviesWeb3.getBalance()
      expect(result).to.equal(0)
    })
  })
  
})
