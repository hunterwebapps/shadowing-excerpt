import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PrimaryLayout from '@components/layouts/PrimaryLayout';
import Login from '@components/Login';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  return (
    <PrimaryLayout>
      <div className={classes.container}>
        <Login />
      </div>
    </PrimaryLayout>
  );
}
