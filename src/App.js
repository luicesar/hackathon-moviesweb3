import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Movie from './components/Movie'
import { Navbar } from './components/Navbar'
import { MovieCard } from './components/MovieCard'

// ABIs
import ETHMoviesWeb3 from './abis/ETHMoviesWeb3.json'

// Config
import config from './config.json';

//Css
import './App.css';

//Api
import api from './services/api';

function App() {

  const [topMovies, setTopMovies] = useState([])

  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [ethMoviesWeb3, setETHMoviesWeb3] = useState(null)
  const [movies, setMovies] = useState([])

  const loadBlockchainData = async () => {
    //2-passo a passo para testar
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    //3-passo a passo para testar
    const network = await provider.getNetwork()
    // const ethMoviesWeb3 = new ethers.Contract(config[network.chainId].ETHMoviesWeb3.address, ETHMoviesWeb3, provider)
    const ethMoviesWeb3 = new ethers.Contract(config[31337].ETHMoviesWeb3.address, ETHMoviesWeb3, provider)
    setETHMoviesWeb3(ethMoviesWeb3)

    //4-passo a passo para testar
    const maxSupply = await ethMoviesWeb3.maxSupply()
    const movies = []
    for (var i = 0; i <= maxSupply; i++) {
      const movie = await ethMoviesWeb3.getMovie(i)
      movies.push(movie)
    }
   
    setMovies(movies)

    //método accountsChanged dispara: ao mudar a conta da cateira no browser
    //1-passo a passo para testar
    window.ethereum.on('accountsChanged', async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await  window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
      }else{
        console.log("Please install Metamask")
      }
    })
  }

   useEffect(() => {
    loadBlockchainData()
  }, [])

  // //API
  // useEffect(() => {

  //   async function getTopRatedMovies(){
  //     await api.get(`/movie/top_rated`)
  //     .then((response) => {
  //       // console.log(JSON.stringify((response.data.results)))
  //       setTopMovies(response.data.results)
  //     })
  //     .catch(()=>{
  //       console('movie not found');
  //       return;
  //     })
  //   }
    
  //   getTopRatedMovies();
    
  //   return () => {
  //     console.log("Disassembled component")
  //   }
  // }, [])

  return (
    <div>

      <Navbar account={account} setAccount={setAccount} />

      <div className="container">
        <h2 className="title">Get Top Rated Movies</h2>
        <div className="movies_container">
          {movies.length === 0 && <p>Carregando...</p>}
          {movies.length > 0 && movies.map((movie, index)=>(
              <MovieCard movie={movie} ethMoviesWeb3={ethMoviesWeb3} provider={provider} id={index + 1} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;