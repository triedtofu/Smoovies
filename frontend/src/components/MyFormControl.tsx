import React from 'react';

import FormControl from '@mui/material/FormControl';

interface WrapperProps {
  children: React.ReactNode;
}

const MyFormControl = (props: WrapperProps) => {
  return (
    <FormControl margin="normal" fullWidth>
      {props.children}
    </FormControl>
  );
}

export default MyFormControl;
