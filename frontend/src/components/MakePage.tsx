import React from 'react';
import { useCookies } from 'react-cookie';

import Navbar from './Navbar';
import NavbarLoggedIn from './NavbarLoggedIn';

// const Nav = (token) => {
//   if (token)
//     return <NavbarLoggedIn />
//   else
// }

const MakePage = (Component: React.ElementType) => {
  const page = () => {
    const [cookies] = useCookies();
    
    return (
      <>
        {cookies.token ? <NavbarLoggedIn id={cookies.token} /> : <Navbar />}
        <Component />
      </>
    )
  }

  return page;
};

export default MakePage;
