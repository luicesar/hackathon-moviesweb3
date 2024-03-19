import { FaStar } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const imageUrl = "https://image.tmdb.org/t/p/w500/"

export const MovieCard = ({ movie, ethMoviesWeb3, provider, id }) => {

  const [owner, setOwner] = useState(null)
  const [hasSold, setHasSold] = useState(false)

  const getOwner = async () => {
    if (movie.isOwned || hasSold) {
      const owner = await ethMoviesWeb3.ownerOf(id)
      setOwner(owner)
    }
  }

  const buyHandler = async () => {
    const signer = await provider.getSigner()
    const transaction = await ethMoviesWeb3.connect(signer).mint(id, { value: movie.cost })
    await transaction.wait()

    setHasSold(true)
  }

  //Após confirmar a compra buyHandler o useEffect entra em ação
  useEffect(() => {
    getOwner()
  }, [hasSold])

  return (
  
    <div className="movie_card">
      <img src={imageUrl + movie?.image} alt={movie?.name} />
      <h2>{movie?.name}</h2>
      <p>
        <FaStar /> {movie?.voteAverage == "" ? "8.565" : movie?.voteAverage}
      </p>

      {movie.isOwned || owner ? (
            <button type="button" onClick={() => console.log('Owned by')}>
               Owned by:<br />
                <span>
                  {owner && owner.slice(0, 6) + '...' + owner.slice(38, 42)}
                </span>
            </button>
          ) : (
            <>
               <button type="button" onClick={() => buyHandler()}>
                By for {ethers.utils.formatUnits(movie.cost.toString(), 'ether')} ETH
               </button>
            </>
          )}
    </div>
  )
}
;