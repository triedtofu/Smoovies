import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import { Context, useContext } from '../context';
import Search from './NewSearch';
import Logo from './Logo';

const pages = [
  ["Higher or Lower", "/higherorlower"]
];

interface NavbarLoggedInProps {
  name: string;
  id: number;
  logout: () => void;
}

const Navbar = (props: NavbarLoggedInProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(Context);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const submitSearch = (movieSearch: string) => {
    navigate(`/search?name=${movieSearch}`);
  }

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const profilePages = [
    ["My Profile", `/user/${props.id}`],
    ["Edit Profile", `/user/${props.id}/edit`],
    ["My Wishlist", `/user/${props.id}/wishlist`],
    ["My Banlist", ""]
  ];

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <div style={{ margin: '5px' }}>
        <Logo/>
      </div>
      <Divider />
      <List>
        {pages.map(item => (
          <ListItem key={item[0]} disablePadding>
            <ListItemButton onClick={() => navigate(item[1])}>
              <ListItemText primary={item[0]} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem>
          <ListItemIcon sx={{ minWidth: '24px', pr: '8px' }}>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={props.name} />
        </ListItem>

        <List disablePadding>
          {profilePages.map(item => (
            <ListItem key={item[0]} disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(item[1])}>
                <ListItemText primary={item[0]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <ListItem disablePadding>
          <ListItemButton onClick={props.logout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Box sx={{ display: { md: 'none' } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' }, height: '100%', width: '120px'}}>
            <Logo />
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Search submitSearch={submitSearch} />
          </Box>
          <Box sx={{ display: 'flex' , alignItems: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page[0]}
                onClick={() => navigate(`/${page[1]}`)}
                sx={{ my: 2, color: 'inherit', display: { xs: 'none', md: 'block' }}}
              >
                {page[0]}
              </Button>
            ))}

            <Button
              sx={{ my: 2, color: 'inherit', display: { xs: 'none', md: 'flex' }}}
              startIcon={<AccountCircle />}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              {props.name}
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
              {profilePages.map(page => (
                <MenuItem key={page[0]} onClick={() => navigate(page[1])}>
                  {page[0]}
                </MenuItem>
              ))}

              <Divider variant="middle" />

              <MenuItem onClick={props.logout}>Logout</MenuItem>
            </Menu>

            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { md: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default Navbar;
