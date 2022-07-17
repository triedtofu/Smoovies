import React from 'react';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';

const Page404 = () => {
  return (
    <Container maxWidth="sm">
      <h2>This page doesn't exist</h2>
    </Container>
  );
};

export default MakePage(Page404);
