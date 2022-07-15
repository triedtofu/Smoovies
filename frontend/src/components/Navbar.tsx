import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import movieLogo from '../logo2.png';
import styles from './Navbar.module.css';
import Search from './Search';

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
        <Link to="/higherorlower" className={styles.linkWithLogo}>
          <SwapVertIcon className={styles.higherorlower}></SwapVertIcon>
          Higher Or Lower
        </Link>
        <div>|</div>
        <Link to="/login" className={styles.Links}>
          Login
        </Link>
        <div>|</div>
        <Link to="/register" className={styles.Links}>
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
