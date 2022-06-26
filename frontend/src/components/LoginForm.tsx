import React, { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';

import MyFormControl from './MyFormControl';
import RequiredTextField from './RequiredTextField';
import styles from './AuthForm.module.css';

const LoginForm = () => {
  const loginSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('TODO Submit');
  };

  return (
    <>
      <form onSubmit={loginSubmit}>
        <MyFormControl>
          <RequiredTextField
            name="email"
            label="Email"
            type="email"
            // value={email}
            // onChange={e => setEmail(e.target.value)}
          />
        </MyFormControl>
        <MyFormControl>
          <RequiredTextField
            name="password"
            label="Enter your password"
            type="password"
            // value={password}
            // onChange={e => setPassword(e.target.value)}
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
