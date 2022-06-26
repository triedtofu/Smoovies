import React from 'react';

import MakePage from '../components/MakePage';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate();

  // code for when I can get token
  // React.useEffect(() => {
  //   if (!token) {
  //     navigate('/login');
  //   }
  // });

  return <h1>Home Page</h1>;
}

export default MakePage(Homepage);
