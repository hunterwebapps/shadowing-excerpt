import React from 'react';
import { any, bool } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  Button as MuiButton,
  CircularProgress,
  IconButton,
} from '@material-ui/core';

Button.propTypes = {
  children: any.isRequired,
  loading: bool,
  icon: bool,
}

const useStyles = makeStyles(theme => ({
  loadingIcon: props => ({
    position: props.isIcon ? 'absolute' : 'relative',
    marginRight: props.isIcon ? '' : '0.5rem',
  }),
}));

function Button({ children, loading, icon, ...props }) {
  const classes = useStyles({ isIcon: !!icon });

  const Button = icon ? IconButton : MuiButton;
  return (
    <Button
      disabled={loading}
      {...props}
    >
      {loading && (
        <CircularProgress
          className={classes.loadingIcon}
          size="1rem"
        />
      )}
      {children}
    </Button>
  );
}

export default Button;
