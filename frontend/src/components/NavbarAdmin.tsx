import React from 'react';
import { useNavigate } from 'react-router-dom';

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

interface NavbarAdminProps {
  name: string;
  logout: () => void;
}

const NavbarAdmin = (props: NavbarAdminProps) => {
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
        <MyLink to="/higherorlower">Higher or Lower</MyLink>
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
            <MenuItem onClick={() => navigate('/addMovie')}>Add Movie</MenuItem>

            <Divider variant="middle" />

            <MenuItem onClick={props.logout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
