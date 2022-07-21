import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormLabel from '@mui/material/FormLabel';

interface ConfirmModalProps {
  title: string;
  body: string;
  confirm: () => void;
  cancel: () => void;
  error: string;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  return (
    <Dialog
      open={true}
      aria-labelledby="confirm-modal-title"
      onClose={props.cancel}
    >
      <DialogTitle id="confirm-modal-title">
        {props.title}
      </DialogTitle>
      <DialogContent>
        {props.body && `${props.body}`}
        {props.error && <FormLabel error>{props.error}</FormLabel>}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={props.cancel}>No</Button>
        <Button name="confirm" onClick={props.confirm}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
