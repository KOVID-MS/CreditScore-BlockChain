// Home.js

import React, { useState, useEffect } from 'react';
import './stylesheets/home.css';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import contractABI from './contract/CreditscoreABI.json';

const Home = ({ setdata }) => {
  const [userAddress, setUserAddress] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDescription, setBillDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [payBillIndex, setPayBillIndex] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [creditScore, setCreditScore] = useState(null);
  const [bills, setBills] = useState([]);
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
            '0x9B2978E8f4feb46Ccd29b63B042135Dc11cb6B7c'
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await contract.methods.viewBills(userAddress).call();
        setBills(result[0]);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    if (contract && userAddress) {
      fetchData();
    }
  }, [contract, userAddress]);

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

      // Convert the due date to seconds (replace this with your date handling logic)
      const dueDateInSeconds = new Date(dueDate).getTime() / 1000;

      await contract.methods.addBill(currentUserAddress, billAmount, billDescription, dueDateInSeconds).send({
        from: currentUserAddress,
      });

      console.log('Bill added successfully');
      setBillAmount('');
      setBillDescription('');
      setDueDate('');
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
      <div className='header'>
        <div className="logo">CreditFlow.</div>
        <div className="user-address">User Address: {userAddress}</div>
        <button className="logout-btn" onClick={logoutHandler}>
          Logout
        </button>
      </div>
      
      <div className="forms" id="options-container">
      <label className='head-label'>
              Add Bill 
            </label>
            <br/>
            <br/>
        <form onSubmit={handleAddBill} className='form1'>
          <div>
            <label className='inputs'>Bill Amount:  </label>
              <input
                className='inp'
                type="number"
                placeholder="Bill Amount"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                required
              />
          </div>
          <div>
            <label className='inputs'> Description: </label>
              <input
                className='inp'
                type="text"
                placeholder="Bill Description"
                value={billDescription}
                onChange={(e) => setBillDescription(e.target.value)}
                required
              />
          </div>
          <div>
            <label className='inputs'> Bill Duedate: </label>
            <input
              className='inp-2'
              type="date"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div>
            <button className='btn-1' type="submit">Add Bill</button>
          </div>       
        </form>

        <form className='form2' onSubmit={handlePayBill}>
          <label className='head-label2'>
            Pay Bill
          </label><br/><br/>
          <label className='inputs'>Bill Index: </label>
            <input
             className='inp'
              type="number"
              placeholder="Bill Index"
              value={payBillIndex}
              onChange={(e) => setPayBillIndex(e.target.value)}
              required
            />
            <button className='btn-2' type="submit"> Pay Bill</button>
          
        </form>

        <form className='form3' onSubmit={handleGetCreditScore}>
          <label className='head-label2'>
          Get Credit Score
          </label><br/><br/>
          <button className='btn-3' type="submit">Get Credit Score</button>
          <br/><br/>
          {creditScore !== null && (
          <div className="score-head">
            <strong className='score' >Your Credit Score:</strong> {creditScore}
          </div>
        )}
        </form>

        <div className="form3">
          <h2 className='head-label2'>View Bills</h2>
          {bills.length > 0 ? (
            <ul className='score'>
              {bills.map((bill, index) => (
                <li key={index}>
                  Index: {index}, Amount: {bill.amount}, Due Date: {new Date(bill.dueDate * 1000).toLocaleDateString()}, Paid: {bill.paid ? 'Yes' : 'No'}, Description: {bill.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No bills to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
