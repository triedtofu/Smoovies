import React from 'react';

import { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import RequiredTextField from './RequiredTextField';

interface ToggleProps {
  value: boolean;
  toggle: () => void;
}

type ToggleablePasswordProps = TextFieldProps & { toggle?: ToggleProps };

const ToggleablePassword = (props: ToggleablePasswordProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const boolShowPassword = props.toggle ? props.toggle.value : showPassword;
  const togglePassword = () => {
    if (props.toggle) {
      props.toggle.toggle();
    } else {
      setShowPassword(!showPassword);
    }
  }

  return (
    <RequiredTextField
      type={boolShowPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={togglePassword}
              edge="end"
            >
              {boolShowPassword ? <Visibility /> : <VisibilityOff /> }
            </IconButton>
          </InputAdornment>
        )
      }}
      {...props}
    />
  );
}

export default ToggleablePassword;
