import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const Movie = ({ movie, ethMoviesWeb3, provider, id }) => {

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
      <div className='card'>
        <div className='card__info'>
          <h3>
            {movie.isOwned || owner ? (
              <del>{movie.name}</del>
            ) : (
              <>{movie.name}</>
            )}
          </h3>
  
          
          <p>
            {movie.isOwned || owner ? (
              //Condição criada quando compra finaliza a compra pela metamask
              <>
                <small>
                  Owned by:<br />
                  <span>
                    {owner && owner.slice(0, 6) + '...' + owner.slice(38, 42)}
                  </span>
                </small>
              </>
            ) : (
              <>
                <strong>
                  {ethers.utils.formatUnits(movie.cost.toString(), 'ether')}
                </strong>
                ETH
              </>
            )}
          </p>
        </div>
  
        {!movie.isOwned && !owner && (
          <button
            type="button"
            className='card__button'
            onClick={() => buyHandler()}
          >
            Buy It
          </button>
        )}
      </div>
    );
}

export default Movie;