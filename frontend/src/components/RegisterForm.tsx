import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import RequiredTextField from './RequiredTextField';
import MyFormControl from './MyFormControl';
import styles from './AuthForm.module.css';

const RegisterForm = () => {
  return (
    <>
      <form>
        <MyFormControl>
          <RequiredTextField
            name="name"
            label="Name"
          />
        </MyFormControl>
        <MyFormControl>
          <RequiredTextField
            name="email"
            label="Email"
            type="email"
          />
        </MyFormControl>
        <MyFormControl>
          <RequiredTextField
            name="password"
            label="Enter your password"
            type="password"
          />
        </MyFormControl>
        <MyFormControl>
          <RequiredTextField
            name="confirm-password"
            label="Confirm your password"
            type="password"
          />
        </MyFormControl>
        <MyFormControl>
          <Button variant="contained" type="submit">Register</Button>
        </MyFormControl>
      </form>

      <div className={styles.box}>
        Already have an account? <Link className={styles.box_link} to="/login">Login</Link>
      </div>
    </>
  )
}

export default RegisterForm;
