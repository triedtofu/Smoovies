import React, { FormEvent } from 'react';

import RequiredTextField from './RequiredTextField';
import MyFormControl from './MyFormControl';
import styles from './AuthForm.module.css';
import ToggleablePassword from './ToggleablePassword';
import MyLink from './MyLink';

import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';

interface RegisterProps {
  submit: (name: string, email: string, password: string) => Promise<void>;
  error: string;
}

const RegisterForm = (props: RegisterProps) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password1, setPassword1] = React.useState('');
  const [password2, setPassword2] = React.useState('');

  const [passwordErr, setPasswordErr] = React.useState('');

  const signupSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password1 === password2) {
      setPasswordErr('');
      props.submit(name, email, password1);
    } else {
      setPasswordErr("Passwords don't match");
    }
  };

  return (
    <>
      <form onSubmit={signupSubmit}>
        <FormLabel error={!!props.error}>{props.error}</FormLabel>
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
          <ToggleablePassword
            name="password"
            label="Enter your password"
            value={password1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword1(e.target.value)
            }
            error={!!passwordErr}
          />
        </MyFormControl>
        <MyFormControl>
          <ToggleablePassword
            name="confirm-password"
            label="Confirm your password"
            value={password2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword2(e.target.value)
            }
            error={!!passwordErr}
          />
        </MyFormControl>
        <FormLabel error={!!passwordErr}>{passwordErr}</FormLabel>
        <MyFormControl>
          <Button variant="contained" type="submit">
            Register
          </Button>
        </MyFormControl>
      </form>

      <div className={styles.box}>
        Already have an account?{' '}
        <MyLink className={styles.boxLink} to="/login">
          Login
        </MyLink>
      </div>
    </>
  );
};

export default RegisterForm;
