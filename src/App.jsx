import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './components/HomePage/HomePage';
import Pantry from './components/Pantry/Pantry';
import Recipes from './components/Recipes/Recipes';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import Footer from './components/Footer/Footer';
import './App.css';
import Register from './components/Register/Register';
import Product from './components/Product/Product';

function App() {
  return (
    <div className="App">
      <Header />
      <main className='wrapper'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<Product />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
