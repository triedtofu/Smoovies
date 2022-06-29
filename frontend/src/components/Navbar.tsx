import React from 'react';
import { Link } from 'react-router-dom';
import movieLogo from '../logo.png';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import styles from './Navbar.module.css';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: alpha(theme.palette.common.white, 0.35),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  borderRadius: '20px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  width: '98%',
}));

const Navbar = () => {
  // const [movieSearch, setMovieSearch] = React.useState('');

  return (
    <nav className={styles.nav}>
      <div className={styles.logoAndSearch}>
        <div className={styles.logoBox}>
          <img src={movieLogo} className={styles.logo} alt="loading" />
        </div>
        <Box className={styles.searchBox}>
          <div className={styles.searchBar}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                // onChange={e => setMovieSearch(e.target.value)}
              />
            </Search>
          </div>
        </Box>
      </div>
      <div className={styles.nav_right}>
<<<<<<< HEAD
        <Link to="/">Home</Link>
        <div>|</div>
        <Link to="/token/wishlist">Wishlist</Link>
        <div>|</div>
=======
        <Link to="/user/1/wishlist">Wishlist</Link>
>>>>>>> fbdd5be159ff81c1096ca1d152d1c0b9fd9ad9ea
        <Link to="/login">Login</Link>
        <div>|</div>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
