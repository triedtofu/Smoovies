import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import Movie from './pages/Movie';
import Search from './pages/Search';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user/:id/wishlist" element={<Wishlist />} />
      <Route path="/movie/:id" element={<Movie />} />
      <Route path="/search/" element={<Search />} />
    </Routes>
  );
};

export default Router;
