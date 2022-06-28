import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { apiAuthLogin } from '../util/api';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies();

  const login = async (email: string, password: string) => {
    try {
      const data = await apiAuthLogin(email, password);
      setCookie('token', data.userId, { path: '/' });
      navigate('/');
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Login</h1>

      <LoginForm submit={login} />
    </Container>
  );
}

export default MakePage(Login);
