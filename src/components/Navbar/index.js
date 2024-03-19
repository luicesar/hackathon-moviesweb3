import{ Link } from 'react-router-dom'
import {BiCameraMovie } from 'react-icons/bi'
import { ethers } from 'ethers';
import { useEffect, useState } from 'react'

import './navbar.css'

export const Navbar = ({ account, setAccount }) => {

  // //setar a carteira no botão ao carregar a página
  // useEffect(() => {

  //   const getAddress = async () => {
  //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     if(accounts !==null)
  //       setAccount(accounts[0]);
  //   }

  //   getAddress();

  // }, [])

    const connectHandler = async (e) => {

        if (typeof window.ethereum !== "undefined") {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const account = ethers.utils.getAddress(accounts[0])
          setAccount(account);
        }
        else{
          console.log("Please install Metamask")
        }
      }
  
    return (
      <nav id="navbar">
        <h2>
          <Link to="/"><BiCameraMovie />MoviesLib</Link>
        </h2>

        {account ? (
        <button
          type="button"
          className='nav-connect'
        >
          <img src="https://chainlist.org/connectors/icn-metamask.svg" className='nav-connect-metamask' width="20" height="20"></img>
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav-connect'
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
      </nav>
    )
  }