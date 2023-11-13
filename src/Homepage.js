import React from 'react'
import {ethers} from 'ethers'
import {useNavigate} from 'react-router-dom'
import './stylesheets/homepage.css'

const Homepage = ({setdata}) => {

  const navigate = useNavigate()
  const clickHandler = () => {
    if (window.ethereum) {
        window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then((res) =>
                accountChangeHandler(res[0])
            )
            .then(()=>navigate('/home'));
    } else {
        alert("install metamask extension!!");
    }
};

const accountChangeHandler = (account) => {
  setdata({
      address: account,
  });

  getbalance(account);
};

const getbalance = (address) => {
  window.ethereum
      .request({
          method: "eth_getBalance",
          params: [address, "latest"],
      })
      .then((balance) => {
          setdata({
              Balance:
                  ethers.utils.formatEther(balance),
          });
      });
};

  return (
    <div className='heading'>
      <h1 className='title'>
        CreditFlow
      </h1>
      <div className='info'>
        Your Score, Your Power, Our Blockchain.

      </div>
      <div className='button'>
        <button className="btn" onClick={clickHandler}>Connect to Metamask </button>
        </div>
    </div>
  )
}

export default Homepage