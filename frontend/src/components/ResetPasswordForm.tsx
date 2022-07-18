import React, { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';

import MyFormControl from './MyFormControl';
import RequiredTextField from './RequiredTextField';

interface ResetPasswordProps {
  submit: (email: string) => void;
  error: string;
}

const ResetPasswordForm = (props: ResetPasswordProps) => {
  const [email, setEmail] = React.useState('');

  const resetFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.submit(email);
  };

  return (
    <>
      <form onSubmit={resetFormSubmit}>
        <FormLabel error={!!props.error}>{props.error}</FormLabel>
        <MyFormControl>
          <RequiredTextField
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </MyFormControl>
        <br />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
