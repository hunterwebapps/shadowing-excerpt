import React from 'react';

import { AppBar, Button, Container, IconButton, InputBase, Toolbar } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  rightActions: {
    textAlign: 'right',
    marginLeft: 'auto',
  },
}));

function FixedHeader({ user, loading, onClickMenu, onLogout }) {
  const classes = useStyles();

  const history = useHistory();

  const handleClickMenu = () => {
    onClickMenu();
  };

  return (
    <AppBar className={classes.appBar}>
      <Container>
        <Toolbar disableGutters>
          <IconButton
            edge="start"
            color="inherit"
            className={classes.menuButton}
            onClick={handleClickMenu}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.rightActions}>
            {user && !user.isAnonymous ? (
              <ProfileDropdown
                user={user}
                loading={loading}
                onLogout={onLogout}
              />
            ) : (
              <Button
                component={Link}
                to={{
                  pathname: '/login',
                  state: { from: history.location },
                }}
                color="inherit"
              >
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default React.memo(FixedHeader);
