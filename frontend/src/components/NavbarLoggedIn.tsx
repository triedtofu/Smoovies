import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import movieLogo from '../logo2.png';
import styles from './NavbarLoggedIn.module.css';

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';

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

interface NavbarLoggedInProps {
  name: string;
  id: number;
  logout: () => void;
}

const NavbarLoggedIn = (props: NavbarLoggedInProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [movieSearch, setMovieSearch] = React.useState('');

  const submitSearch = () => {
    navigate(`/search?name=${movieSearch}`);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const gotoProfilePage = () => {
    // TODO
  };

  const gotoWishlist = () => {
    navigate(`/user/${props.id}/wishlist`);
  };

  const gotoBanlist = () => {
    // TODO
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logoAndSearch}>
        <div className={styles.logoBox}>
          <img
            src={movieLogo}
            className={styles.logo}
            alt="loading"
            onClick={(_) => navigate('/')}
          />
        </div>
        <Box className={styles.searchBox}>
          <div className={styles.searchBar}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <form onSubmit={submitSearch}>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={movieSearch}
                  onChange={(e) => setMovieSearch(e.target.value)}
                />
              </form>
            </Search>
          </div>
        </Box>
      </div>
      <div className={styles.nav_right}>
        <Link to="/higherorlower">Higher or Lower</Link>
        <div>|</div>
        <div className={styles.dashboard}>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <ArrowDropDownIcon />
            Hello {props.name}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={gotoProfilePage}>My Profile</MenuItem>
            <MenuItem onClick={gotoWishlist}>My Wishlist</MenuItem>
            <MenuItem onClick={gotoBanlist}>My Banlist</MenuItem>

            <Divider variant="middle" />

            <MenuItem onClick={props.logout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLoggedIn;
