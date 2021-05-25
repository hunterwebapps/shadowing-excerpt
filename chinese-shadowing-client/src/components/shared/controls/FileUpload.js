import React from 'react';
import { func, string, bool } from 'prop-types';

import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';

FileUpload.propTypes = {
  accept: string.isRequired,
  children: string.isRequired,
  id: string.isRequired,
  className: string,
  onChange: func.isRequired,
  loading: bool,
};

const useStyles = makeStyles((theme) => ({
  file: {
    display: 'none',
  },
  spinner: {
    marginLeft: theme.spacing(1),
  },
}));

export default function FileUpload({
  accept,
  children,
  className,
  id,
  loading,
  onChange,
  disabled = false,
}) {
  const classes = useStyles();

  disabled = loading || disabled;

  return (
    <React.Fragment>
      <label htmlFor={id}>
        <Button
          variant="contained"
          color="primary"
          className={className}
          disabled={disabled}
          startIcon={
            loading
              ? <CircularProgress color="inherit" size="1rem" />
              : <CloudUploadIcon />
          }
          component="span"
        >
          {children}
        </Button>
      </label>
      <input
        accept={accept}
        className={classes.file}
        id={id}
        type="file"
        disabled={disabled}
        onChange={onChange}
      />
    </React.Fragment>
  );
}
