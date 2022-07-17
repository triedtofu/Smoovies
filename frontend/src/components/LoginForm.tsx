import React, { FormEvent } from 'react';

import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';

import MyFormControl from './MyFormControl';
import MyLink from './MyLink';
import RequiredTextField from './RequiredTextField';
import styles from './AuthForm.module.css';
import ToggleablePassword from './ToggleablePassword';

interface LoginProps {
  submit: (email: string, password: string) => Promise<void>;
  error: string;
}

const LoginForm = (props: LoginProps) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const loginSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.submit(email, password);
  };

  return (
    <>
      <form onSubmit={loginSubmit}>
        <FormLabel error={Boolean(props.error)}>{props.error}</FormLabel>
        <MyFormControl>
          <RequiredTextField
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </MyFormControl>
        <MyFormControl>
          <ToggleablePassword
            name="password"
            label="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </MyFormControl>
        <MyFormControl>
          <Button variant="contained" type="submit">
            Login
          </Button>
        </MyFormControl>
      </form>

      <div className={styles.box}>
        Don&apos;t have an account?{' '}
        <MyLink className={styles.boxLink} to="/register">
          Register
        </MyLink>
        &nbsp; | Forgot Password?
        <MyLink className={styles.boxLink} to="/resetpassword">
          Reset Password
        </MyLink>
      </div>
    </>
  );
};

export default LoginForm;
