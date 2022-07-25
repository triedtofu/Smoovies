import React from 'react';
import { Helmet } from 'react-helmet-async';

import { apiRequestResetPassword } from '../util/api';
import { getErrorMessage } from '../util/helper';

import MakePage from '../components/MakePage';
import ResetPasswordForm from '../components/ResetPasswordForm';

import Container from '@mui/material/Container';

const ForgotPassword = () => {
  const [errorStr, setErrorStr] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const resetPassword = (email: string) => {
    try {
      apiRequestResetPassword(email)
        .then(() => setSuccess(true))
        .catch(error => setErrorStr(getErrorMessage(error)));
    } catch (error) {
      setErrorStr(getErrorMessage(error));
    }
  };

  if (success) return (
    <Container maxWidth="md">
      <h2>An email with a link has been sent to your registered email account</h2>
    </Container>
  );

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>Forgot Password - Smoovies</title>
      </Helmet>

      <h2>Forgot your password?</h2>
      <h2>Enter your email.</h2>
      <ResetPasswordForm submit={resetPassword} error={errorStr} />
    </Container>
  );
};

export default MakePage(ForgotPassword);
