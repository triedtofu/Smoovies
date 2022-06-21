import React from 'react';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <Container maxWidth="sm">
      <h1>Register</h1>

      <RegisterForm />
    </Container>
  );
}

export default MakePage(Register);
