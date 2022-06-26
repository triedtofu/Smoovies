import React from 'react';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import RegisterForm from '../components/RegisterForm';

import { apiAuthRegister } from '../util/api';

const Register = () => {
  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await apiAuthRegister(name, email, password);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Register</h1>

      <RegisterForm success={register} />
    </Container>
  );
}

export default MakePage(Register);
