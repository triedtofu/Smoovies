import React from 'react';

import Navbar from './Navbar';

const MakePage = (Component: React.ElementType) => {

  return () => (
    <>
      <Navbar />
      <Component />
    </>
  );
}

export default MakePage;
