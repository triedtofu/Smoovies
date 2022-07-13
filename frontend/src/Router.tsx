import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import Movie from './pages/Movie';
import Search from './pages/Search';
import HigherOrLower from './pages/HigherOrLower';
import AddMovie from './pages/AddMovie';
import TestingUI from './pages/TestingUI';
import Profile from './pages/Profile';
import Page404 from './pages/Page404';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user/:id/wishlist" element={<Wishlist />} />
      <Route path="/movie/:id" element={<Movie />} />
      <Route path="/search" element={<Search />} />
      <Route path="/higherorlower" element={<HigherOrLower />} />
      <Route path="/addmovie" element={<AddMovie />} />
      <Route path="/movie/:id/testingui" element={<TestingUI />} />
      <Route path="/user/:id" element={<Profile />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default Router;
