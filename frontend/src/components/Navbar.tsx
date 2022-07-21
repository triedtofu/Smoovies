import React from 'react';
import { useNavigate } from 'react-router-dom';

import movieLogo from '../logo2.png';
import styles from './Navbar.module.css';
import Search from './Search';
import MyLink from './MyLink';

import Box from '@mui/material/Box';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const Navbar = () => {
  const navigate = useNavigate();

  const submitSearch = (movieSearch: string) => {
    navigate(`/search?name=${movieSearch}`);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logoAndSearch}>
        <div className={styles.logoBox}>
          <img
            src={movieLogo}
            className={styles.logo}
            onClick={(_) => navigate('/')}
            alt="loading"
          />
        </div>
        <Box className={styles.searchBox}>
          <div className={styles.searchBar}>
            <Search submitSearch={submitSearch} />
          </div>
        </Box>
      </div>
      <div className={styles.nav_right}>
        <MyLink to="/higherorlower" className={styles.linkWithLogo}>
          <SwapVertIcon className={styles.higherorlower}></SwapVertIcon>
          Higher Or Lower
        </MyLink>
        <div>|</div>
        <MyLink to="/login">
          Login
        </MyLink>
        <div>|</div>
        <MyLink to="/register">
          Register
        </MyLink>
      </div>
    </nav>
  );
};

export default Navbar;
