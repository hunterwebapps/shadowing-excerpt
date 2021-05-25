import React from 'react';
import { bool, func, string } from 'prop-types';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from '@material-ui/core';
import Button from '../controls/Button';
import Draggable from 'react-draggable';

ConfirmDialog.propTypes = {
  title: string.isRequired,
  open: bool.isRequired,
  text: string.isRequired,
  confirmText: string,
  cancelText: string,
  onConfirm: func.isRequired,
  onCancel: func.isRequired,
};

function ConfirmDialog({
  title,
  open,
  text,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const PaperComponent = (props) => (
    <Draggable
      handle="#draggable-dialog-title"
      cancel='[class*="MuiDialogContent-root"]'
    >
      <Paper {...props} />
    </Draggable>
  );

  return (
    <Dialog
      open={open}
      PaperComponent={PaperComponent}
      onClose={handleCancel}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={handleCancel}>
          {cancelText}
        </Button>
        <Button color="primary" onClick={handleConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
