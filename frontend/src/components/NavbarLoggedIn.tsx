import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import movieLogo from '../logo2.png';
import styles from './NavbarLoggedIn.module.css';
import Search from './Search';
import MyLink from './MyLink';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';

interface NavbarLoggedInProps {
  name: string;
  id: number;
  logout: () => void;
}

const NavbarLoggedIn = (props: NavbarLoggedInProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const submitSearch = (movieSearch: string) => {
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
            <Search submitSearch={submitSearch} />
          </div>
        </Box>
      </div>
      <div className={styles.nav_right}>
        <MyLink to="/higherorlower" className={styles.Links}>
          Higher or Lower
        </MyLink>
        <div>|</div>
        <div className={styles.dashboard}>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <ArrowDropDownIcon style={{ color: '#522381' }} />
            <span style={{ color: '#522381' }}>Hello {props.name}</span>
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
