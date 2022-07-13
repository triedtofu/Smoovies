import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Container from '@mui/material/Container';

import { apiAuthLogin } from '../util/api';
import { getErrorMessage } from '../util/helper';

import MakePage from '../components/MakePage';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies();

  const [loginErr, setLoginErr] = React.useState('');

  const login = async (email: string, password: string) => {
    try {
      const data = await apiAuthLogin(email, password);
      setCookie('token', data.token, { path: '/' });
      setCookie('name', data.name, { path: '/' });
      if (data.isAdmin) setCookie('admin', data.isAdmin, { path: '/' });
      navigate('/');
    } catch (error) {
      const errStr = getErrorMessage(error);

      if (errStr === 'Invalid input') {
        setLoginErr("Email and password don't match");
      } else {
        setLoginErr(getErrorMessage(error));
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Login</h1>
      <LoginForm submit={login} error={loginErr} />
    </Container>
  );
};

export default MakePage(Login);
