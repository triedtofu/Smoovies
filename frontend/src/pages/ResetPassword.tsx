import React from 'react';

import MakePage from '../components/MakePage';
import ResetPasswordForm from '../components/ResetPasswordForm';

import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [resetPasswordErr, setResetPasswordErr] = React.useState('');

  const resetPassword = async (email: string) => {
    try {
      // TODO
      console.log('pressed submit');
      navigate('/resetpassword/success');
    } catch (error) {
      setResetPasswordErr('Email given does not exist.');
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Resetting Password</h1>
      <ResetPasswordForm submit={resetPassword} error={resetPasswordErr} />
    </Container>
  );
};

export default MakePage(ResetPassword);
