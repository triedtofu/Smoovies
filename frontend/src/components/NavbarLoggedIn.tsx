import React from 'react';
import { Link } from 'react-router-dom';

import styles from './NavbarLoggedIn.module.css';

const NavbarLoggedIn = () => {
  return (
    <nav className={styles.nav}>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div className={styles.nav_right}>
        <Link to="/token/wishlist">Wishlist</Link>
        <Link to="/higherorlower">Higher or Lower</Link>
      </div>
    </nav>
  );
};

export default NavbarLoggedIn;
