import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import MakePage from '../components/MakePage';
import ToggleablePassword from '../components/ToggleablePassword';
import MyFormControl from '../components/MyFormControl';
import Container from '../components/MyContainer';

import { apiResetPassword } from '../util/api';
import { getErrorMessage } from '../util/helper';

import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';

const ResetPassword= () => {
  const [searchParams] = useSearchParams();

  const [password1, setPassword1] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [success, setSuccess] = React.useState(false);


  const [passwordErr, setPasswordErr] = React.useState('');
  const [errorStr, setErrorStr] = React.useState('');

  const resetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password1 === password2) {
      setPasswordErr('');
      apiResetPassword(searchParams.get('token') ?? '',  password1)
        .then(() => setSuccess(true))
        .catch(error => setErrorStr(getErrorMessage(error)));
    } else {
      setPasswordErr("Passwords don't match");
    }
  };

  if (searchParams.get('token') === null) return (
    <Container maxWidth="md">
      <h2>Invalid link</h2>
    </Container>
  );

  if (success) return (
    <Container maxWidth="md">
      <h2>Your password has been reset. Click <Link to="/login">here to login.</Link></h2>
    </Container>
  );

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1">Reset Password</Typography>

      <form onSubmit={resetSubmit}>
        <FormLabel error={!!errorStr}>{errorStr}</FormLabel>
        <MyFormControl>
          <ToggleablePassword
            name="password"
            label="Enter your password"
            value={password1}
            onChange={e => setPassword1(e.target.value)}
            error={!!passwordErr}
          />
        </MyFormControl>
        <MyFormControl>
          <ToggleablePassword
            name="confirm-password"
            label="Confirm your password"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            error={!!passwordErr}
          />
        </MyFormControl>
        <FormLabel error={!!passwordErr}>{passwordErr}</FormLabel>
        <MyFormControl>
          <Button variant="contained" type="submit">
            Reset
          </Button>
        </MyFormControl>
      </form>
    </Container>
  );
};

export default MakePage(ResetPassword);
