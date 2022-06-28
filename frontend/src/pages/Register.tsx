import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import RegisterForm from '../components/RegisterForm';

import { apiAuthRegister } from '../util/api';

const Register = () => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies();

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await apiAuthRegister(name, email, password);
      setCookie('token', data.userId, { path: '/' });
      navigate('/');

      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Register</h1>

      <RegisterForm submit={register} />
    </Container>
  );
}

export default MakePage(Register);
