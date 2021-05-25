import React from 'react';
import { connect } from 'react-redux';
import { selectSnack } from '@store/snackbar';
import { popSnack } from '@store/snackbar';

import { Snackbar as MaterialSnackbar, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

const mapStateToProps = state => ({
  snack: selectSnack(state),
});

const mapDispatchToProps = {
  popSnack,
};

function Snackbar({ snack, popSnack }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!snack) return;
    setOpen(true);
  }, [snack]);

  const handleClose = (_e, reason) => {
    if (reason === 'clickaway') return;

    setOpen(false);
    setTimeout(popSnack, 500);
  };

  if (!snack) return null;

  return (
    <MaterialSnackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={snack.duration}
    >
      <Alert
        severity={snack.severity}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {snack.message}
      </Alert>
    </MaterialSnackbar>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
