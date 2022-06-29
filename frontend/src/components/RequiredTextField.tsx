import React from 'react';
import { CookiesProvider } from 'react-cookie';

import TextField, { TextFieldProps } from '@mui/material/TextField';

const RequiredTextField = (props: TextFieldProps): JSX.Element => {
  return (
    <TextField
      required
      InputLabelProps={{ required: false }}
      { ...props }
    />
  );
}

export default RequiredTextField;
