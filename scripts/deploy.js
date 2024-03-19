// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');
const listMovies = JSON.parse(fs.readFileSync('./src/util/listMovies.json', 'utf8'));

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

  // Setup accounts & variables
  const [deployer] = await hre.ethers.getSigners()
  const NAME = "ETH Movies Web3"
  const SYMBOL = "ETHMW3"

  // Deploy contract
  const ETHMoviesWeb3 = await hre.ethers.getContractFactory("ETHMoviesWeb3")
  const ethMoviesWeb3 = await ETHMoviesWeb3.deploy(NAME, SYMBOL)
  await ethMoviesWeb3.deployed();

  console.log(`Deployed Movie Contract at: ${ethMoviesWeb3.address}\n`)

  //Set List 20 movies: enviando para a blockain
  for (var i = 0; i < listMovies.length; i++) {
    const cost = 12 + i;

    const transaction = await ethMoviesWeb3.connect(deployer).list(listMovies[i].title, tokens(7), listMovies[i].vote_average, listMovies[i].poster_path)
    await transaction.wait()

    console.log(`Listed Movie ${listMovies[i].id}: ${listMovies[i].title}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
