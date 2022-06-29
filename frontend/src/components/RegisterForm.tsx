import React, { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import RequiredTextField from './RequiredTextField';
import MyFormControl from './MyFormControl';
import styles from './AuthForm.module.css';

interface RegisterProps {
  success: (name: string, email: string, password: string) => Promise<void>;
}

const RegisterForm = (props: RegisterProps) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password1, setPassword1] = React.useState('');
  const [password2, setPassword2] = React.useState('');

  const signupSubmit = (e: FormEvent) => {
    e.preventDefault();

    props.success(name, email, password1);
  };

  return (
    <>
      <form onSubmit={signupSubmit}>
        <MyFormControl>
          <RequiredTextField
            name="name"
            label="Name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </MyFormControl>
        <MyFormControl>
          <RequiredTextField
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </MyFormControl>
        <MyFormControl>
          <RequiredTextField
            name="password"
            label="Enter your password"
            type="password"
            value={password1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword1(e.target.value)
            }
          />
        </MyFormControl>
        <MyFormControl>
          <RequiredTextField
            name="confirm-password"
            label="Confirm your password"
            type="password"
            value={password2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword2(e.target.value)
            }
          />
        </MyFormControl>
        <MyFormControl>
          <Button variant="contained" type="submit">
            Register
          </Button>
        </MyFormControl>
      </form>

      <div className={styles.box}>
        Already have an account?{' '}
        <Link className={styles.box_link} to="/login">
          Login
        </Link>
      </div>
    </>
  );
};

export default RegisterForm;
