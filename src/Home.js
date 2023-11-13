import React, { useState, useEffect } from 'react';
import './stylesheets/home.css';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import contractABI from './contract/CreditscoreABI.json';

const Home = ({ setdata }) => {
  const [userAddress, setUserAddress] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDescription, setBillDescription] = useState('');
  const [payBillIndex, setPayBillIndex] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [creditScore, setCreditScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          const currentUserAddress = accounts[0];
          setUserAddress(currentUserAddress);
          setWeb3(web3Instance);

          const contractInstance = new web3Instance.eth.Contract(
            contractABI.abi,
            '0x54520b2b16250CE6cb887f74AD268189CdBCc829'
          );
          setContract(contractInstance);
        } catch (error) {
          console.error('Error initializing Web3:', error);
        }
      } else {
        console.error('Please install MetaMask!');
      }
    };

    initWeb3();
  }, []);

  const logoutHandler = () => {
    localStorage.clear();
    setdata({ address: '' });
    navigate('/');
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      const currentUserAddress = accounts[0];

      await contract.methods.addBill(currentUserAddress, billAmount, billDescription).send({
        from: currentUserAddress,
      });

      console.log('Bill added successfully');
      setBillAmount('');
      setBillDescription('');
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  };

  const handlePayBill = async (e) => {
    e.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      const currentUserAddress = accounts[0];

      await contract.methods.payBill(currentUserAddress, payBillIndex).send({
        from: currentUserAddress,
      });

      console.log('Bill paid successfully');
      setPayBillIndex('');
    } catch (error) {
      console.error('Error paying bill:', error);
    }
  };

  const handleGetCreditScore = async (e) => {
    e.preventDefault();
    try {
      const creditScoreValue = await contract.methods.getCreditScore(userAddress).call();
      console.log('Credit Score:', creditScoreValue);
      setCreditScore(creditScoreValue);
    } catch (error) {
      console.error('Error getting credit score:', error);
    }
  };

  return (
    <div className="App">
      <div className="user-address">User Address: {userAddress}</div>
      <div className="logo">Creditflow</div>
      <button className="logout-btn" onClick={logoutHandler}>
        Logout
      </button>
      <div className="buttons" id="options-container">
        <form onSubmit={handleAddBill}>
          <label>
            Add Bill:
            <input
              type="number"
              placeholder="Bill Amount"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Bill Description"
              value={billDescription}
              onChange={(e) => setBillDescription(e.target.value)}
              required
            />
            <button type="submit">Add Bill</button>
          </label>
        </form>

        <form onSubmit={handlePayBill}>
          <label>
            Pay Bill:
            <input
              type="number"
              placeholder="Bill Index"
              value={payBillIndex}
              onChange={(e) => setPayBillIndex(e.target.value)}
              required
            />
            <button type="submit">Pay Bill</button>
          </label>
        </form>

        <form onSubmit={handleGetCreditScore}>
          <label>
            Get Credit Score:
            <button type="submit">Get Credit Score</button>
          </label>
        </form>

        {creditScore !== null && (
          <div className="credit-score-result">
            Credit Score: {creditScore}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
