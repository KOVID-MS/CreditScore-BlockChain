import React,{useState} from 'react';
import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './Home.js';
import Homepage from './Homepage.js';
function App() {

  const [data, setdata] = useState({
    address: "",
    Balance: null,
});
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage setdata={setdata} />} />
      <Route path='/home' element={<Home setdata={setdata}/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
