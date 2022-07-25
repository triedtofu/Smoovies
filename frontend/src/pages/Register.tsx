import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';

import Container from '../components/MyContainer';
import MakePage from '../components/MakePage';
import RegisterForm from '../components/RegisterForm';

import { apiAuthRegister } from '../util/api';
import { getErrorMessage } from '../util/helper';

import Typography from '@mui/material/Typography';

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

      <Typography variant="h4" component="h1">Register</Typography>

      <RegisterForm submit={register} error={registerErr} />
    </Container>
  );
}

export default MakePage(Register);
