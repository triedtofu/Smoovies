import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import Blacklist from './pages/Blacklist';
import Movie from './pages/Movie';
import Search from './pages/Search';
import HigherOrLower from './pages/HigherOrLower';
import AddMovie from './pages/AddMovie';
import TestingUI from './pages/TestingUI';
import Profile from './pages/Profile';
import Page404 from './pages/Page404';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EditMovie from './pages/EditMovie';
import Actor from './pages/Actor';
import Director from './pages/Director';

// Manages the routes

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/user/:id/wishlist" element={<Wishlist />} />
      <Route path="/user/:id/blacklist" element={<Blacklist />} />
      <Route path="/movie/:id" element={<Movie />} />
      <Route path="/movie/:id/edit" element={<EditMovie />} />
      <Route path="/search" element={<Search />} />
      <Route path="/higherorlower" element={<HigherOrLower />} />
      <Route path="/addmovie" element={<AddMovie />} />
      <Route path="/movie/:id/testingui" element={<TestingUI />} />
      <Route path="/user/:id" element={<Profile />} />
      <Route path="/actor/:id" element={<Actor />} />
      <Route path="/director/:id" element={<Director />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default Router;
