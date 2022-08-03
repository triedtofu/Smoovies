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

import Logo from './Logo';

import { Context, useContext } from '../context';
import Search from './NewSearch';

const pages = [
  ["Higher or Lower", "/higherorlower"],
  ["Login", "/login"],
  ["Register", "/register"],
];

const NewNavbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(Context);

  const submitSearch = (movieSearch: string) => {
    navigate(`/search?name=${movieSearch}`);
  }

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      {/* <Typography
        variant="h6"
        sx={{
          my: 2,
        }}>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Smoovies</a>
      </Typography> */}
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
      </List>
    </Box>
  );

  return (
    <Box>
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
                onClick={() => navigate(page[1])}
                sx={{ my: 2, color: 'inherit', display: { xs: 'none', md: 'block' }}}
              >
                {page[0]}
              </Button>
            ))}

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

export default NewNavbar;
