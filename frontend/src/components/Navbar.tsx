import React from 'react';
import { Link } from 'react-router-dom';
import movieLogo from '../logo.png';

import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <nav>
        <div>
          <img src={movieLogo} className={styles.logo} alt="loading" />
        </div>
      </nav>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div className={styles.nav_right}>
        <Link to="/user/1/wishlist">Wishlist</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
