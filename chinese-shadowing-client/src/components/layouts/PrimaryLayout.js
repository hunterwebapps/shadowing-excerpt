import React from 'react';
import { bool } from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { logout, selectLoading, selectUser } from '@store/auth';

import { Container, Drawer, Typography } from '@material-ui/core';
import Snackbar from '@components/shared/Snackbar';
import FixedHeader from './FixedHeader';
import NavBar from './NavBar';

PrimaryLayout.propTypes = {
  disableGutters: bool,
};

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor: theme.palette.background.default,
  },
  drawer: {
    width: drawerWidth,
    zIndex: '1200!important',
  },
  drawerPaper: {
    width: drawerWidth,
    paddingTop: '4rem',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '3.5rem',
    },
  },
}));

const mapStateToProps = state => ({
  user: selectUser(state),
  loading: selectLoading(state),
});

const mapDispatchToProps = {
  logout,
};

function PrimaryLayout({ children, title, user, loading, logout, disableGutters = false }) {
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const classes = useStyles();

  const handleClickMenu = () => {
    setDrawerOpen(isOpen => !isOpen);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div className={classes.root}>
      <FixedHeader
        user={user}
        loading={loading}
        onLogout={logout}
        onClickMenu={handleClickMenu}
      />

      <Container disableGutters={disableGutters}>
        <Drawer
          variant="temporary"
          onClose={handleCloseDrawer}
          open={isDrawerOpen}
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
        >
          <NavBar />
        </Drawer>

        {title && (
          <Typography variant="h5" component="h1" gutterBottom>
            {title}
          </Typography>
        )}

        {children}
      </Container>

      <Snackbar />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PrimaryLayout));
