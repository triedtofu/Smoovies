import React from 'react';
import { Helmet } from 'react-helmet-async';

import { apiRequestResetPassword } from '../util/api';
import { getErrorMessage } from '../util/helper';

import MakePage from '../components/MakePage';
import ResetPasswordForm from '../components/ResetPasswordForm';
import Container from '../components/MyContainer';

import Typography from '@mui/material/Typography';

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
      <Typography variant="h5" component="h2">
        An email with a link has been sent to your registered email account
      </Typography>
    </Container>
  );

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>Forgot Password - Smoovies</title>
      </Helmet>

      <Typography gutterBottom variant="h5" component="h2">Forgot your password?</Typography>
      <Typography variant="h5" component="h2">Enter your email.</Typography>
      <ResetPasswordForm submit={resetPassword} error={errorStr} />
    </Container>
  );
};

export default MakePage(ForgotPassword);
