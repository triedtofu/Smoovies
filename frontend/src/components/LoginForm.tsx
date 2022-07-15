import React, { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';

import MyFormControl from './MyFormControl';
import RequiredTextField from './RequiredTextField';
import styles from './AuthForm.module.css';

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
          <RequiredTextField
            name="password"
            label="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              return false;
            }}
            onCopy={(e) => {
              e.preventDefault();
              return false;
            }}
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
        <Link className={styles.box_link} to="/register">
          Register
        </Link>
      </div>
    </>
  );
};

export default LoginForm;
