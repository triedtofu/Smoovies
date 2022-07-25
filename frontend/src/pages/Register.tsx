import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import RegisterForm from '../components/RegisterForm';

import { apiAuthRegister } from '../util/api';
import { getErrorMessage } from '../util/helper';

const Register = () => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies();

  const [registerErr, setRegisterErr] = React.useState('');

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await apiAuthRegister(name, email, password);
      setCookie('token', data.token, { path: '/' });
      setCookie('name', data.name, { path: '/' });
      navigate('/');
    } catch (error) {
      setRegisterErr(getErrorMessage(error));
    }
  };

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>Register - Smoovies</title>
      </Helmet>

      <h1>Register</h1>

      <RegisterForm submit={register} error={registerErr} />
    </Container>
  );
}

export default MakePage(Register);
