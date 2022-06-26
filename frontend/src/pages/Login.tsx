import React from 'react';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <Container maxWidth="sm">
      <h1>Login</h1>

      <LoginForm />
    </Container>
  );
}

export default MakePage(Login);
