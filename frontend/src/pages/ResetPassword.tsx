import React from 'react';
import { useSearchParams } from 'react-router-dom';

import MakePage from '../components/MakePage';
import ToggleablePassword from '../components/ToggleablePassword';
import MyFormControl from '../components/MyFormControl';
import Container from '../components/MyContainer';
import MyLink from '../components/MyLink';

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

  const [showPasswords, setShowPasswords] = React.useState(false);
  const toggleProps = { value: showPasswords, toggle: () => setShowPasswords(!showPasswords) };

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
      <Typography variant="h5" component="h2">Invalid link</Typography>
    </Container>
  );

  if (success) return (
    <Container maxWidth="md">
      <Typography variant="h5" component="h2">
        Your password has been reset. Click <MyLink href="/login">here to login.</MyLink>
      </Typography>
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
            toggle={toggleProps}
          />
        </MyFormControl>
        <MyFormControl>
          <ToggleablePassword
            name="confirm-password"
            label="Confirm your password"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            error={!!passwordErr}
            toggle={toggleProps}
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
