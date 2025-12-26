import './App.css'
import { useState } from 'react'
import ListOrders from './ListOrders';
import ApiContext from './ApiContext';
import Register from './Register';
import Verify from './Verify';
import Login from './Login';
import Me from './Me';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const [apiKey, setApiKey] = useState(localStorage.getItem('token'));

  return (
    <ApiContext.Provider value={{ url: apiUrl, key: apiKey, setKey: setApiKey }}>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/register" replace />}></Route>

          <Route path='/register' element={<Register />}></Route>
          <Route path='/verify' element={<Verify />}></Route>
          <Route path='/login' element={<Login />}></Route>
          
          <Route path='/me' element={<Me />}></Route>
          <Route path='/orders' element={<ListOrders />}></Route>
        </Routes>
      </Router>
    </ApiContext.Provider>
  )
}

export default App