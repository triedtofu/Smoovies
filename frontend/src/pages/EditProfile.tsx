import React from 'react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';

import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import {
  apiGetUserDetails,
  apiUpdateUserDetails,
  UpdateUserParams,
} from '../util/api';
import { getErrorMessage } from '../util/helper';

import styles from './EditProfile.module.css';

import MakePage from '../components/MakePage';
import Container from '../components/MyContainer';
import ToggleablePassword from '../components/ToggleablePassword';

let originalName = '';
let originalEmail = '';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditProfile = () => {
  const [cookies, setCookie] = useCookies();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPasword, setConfirmNewPassword] = React.useState('');

  const [disabledButton1, setDisabledButton1] = React.useState(false);
  const [disabledButton2, setDisabledButton2] = React.useState(false);

  const [errorStr1, setErrorStr1] = React.useState('');
  const [errorStr2, setErrorStr2] = React.useState('');

  const [alertOpen, setAlertOpen] = React.useState(false);

  const [showPasswords, setShowPasswords] = React.useState(false);
  const toggleProps = {
    value: showPasswords,
    toggle: () => setShowPasswords(!showPasswords),
  };

  React.useEffect(() => {
    if (!cookies.token) return;

    apiGetUserDetails(cookies.token).then((data) => {
      setName(data.name);
      originalName = data.name;
      setEmail(data.email);
      originalEmail = data.email;
    });
  }, []);

  const newDetails = () => {
    const nameChanged = name !== originalName && name !== '';
    const emailChanged = email !== originalEmail && email !== '';

    return nameChanged || emailChanged;
  };

  const canSubmitPassword = oldPassword && newPassword && confirmNewPasword;

  const handleAlertClose = () => setAlertOpen(false);

  const updateDetails = (e: React.FormEvent) => {
    e.preventDefault();

    setAlertOpen(false);
    setDisabledButton1(true);
    setErrorStr1('');

    const params: UpdateUserParams = { token: cookies.token };

    if (name !== originalName) params.name = name;
    if (email !== originalEmail) params.email = email;

    apiUpdateUserDetails(params)
      .then(() => {
        setAlertOpen(true);
        setDisabledButton1(false);

        if (params.name) {
          setCookie('name', params.name, { path: '/' });
          originalName = params.name;
        }

        if (params.email) originalEmail = params.email;
      })
      .catch((error) => {
        setDisabledButton1(false);
        setErrorStr1(getErrorMessage(error));
      });
  };

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    setErrorStr2('');
    setAlertOpen(false);
    setDisabledButton2(true);

    if (newPassword !== confirmNewPasword) {
      setErrorStr2(
        'New password and new password confirmation are not the same'
      );
      setDisabledButton2(false);
      return;
    }

    const params: UpdateUserParams = {
      token: cookies.token,
      oldPassword,
      password: newPassword,
    };

    apiUpdateUserDetails(params)
      .then(() => {
        setAlertOpen(true);
        setDisabledButton2(false);

        // reset form
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      })
      .catch((error) => {
        setDisabledButton2(false);
        setErrorStr2(getErrorMessage(error));
      });
  };

  if (!cookies.token) return <p>Only available to logged in users</p>;

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>Edit Profile - Smoovies</title>
      </Helmet>

      <Typography
        gutterBottom
        variant="h4"
        component="h1"
        fontFamily={'Verdana'}
      >
        Edit Profile
      </Typography>

      <form onSubmit={updateDetails} className={styles.form}>
        {errorStr1 && (
          <FormLabel sx={{ width: '100%' }} error={true}>
            {errorStr1}
          </FormLabel>
        )}
        <TextField
          name="name"
          label="Name"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        <TextField
          name="email"
          label="Email"
          type="email"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <div className={styles.buttonDiv}>
          <Button
            variant="contained"
            type="submit"
            disabled={disabledButton1 || !newDetails()}
          >
            Update
          </Button>
        </div>
      </form>

      <Typography
        gutterBottom
        variant="h5"
        component="h2"
        fontFamily={'Verdana'}
      >
        Password
      </Typography>

      <form onSubmit={updatePassword} className={styles.form}>
        {errorStr2 && <FormLabel error={true}>{errorStr2}</FormLabel>}
        <ToggleablePassword
          name="Old password"
          label="Old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          size="small"
          fullWidth
          required
        />

        <ToggleablePassword
          name="New password"
          label="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          toggle={toggleProps}
          size="small"
          fullWidth
          required
        />

        <ToggleablePassword
          name="Confirm new password"
          label="Confirm new password"
          value={confirmNewPasword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          toggle={toggleProps}
          size="small"
          fullWidth
          required
        />

        <div className={styles.buttonDiv}>
          <Button
            variant="contained"
            type="submit"
            disabled={disabledButton2 || !canSubmitPassword}
          >
            Update
          </Button>
        </div>
      </form>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Updated.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MakePage(EditProfile);
