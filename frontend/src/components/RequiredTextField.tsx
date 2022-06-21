import React from 'react';

import TextField from '@mui/material/TextField';

const RequiredTextField = (props: any): JSX.Element => {
  return (
    <TextField
      required
      InputLabelProps={{ required: false }}
      { ...props }
    />
  );
}

export default RequiredTextField;
