import React from 'react';

import Container from '../components/MyContainer';
import MakePage from '../components/MakePage';

const Page404 = () => {
  return (
    <Container maxWidth="md">
      <h2>This page doesn't exist</h2>
    </Container>
  );
};

export default MakePage(Page404);
