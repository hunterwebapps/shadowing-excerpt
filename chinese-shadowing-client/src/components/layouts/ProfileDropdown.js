import React from 'react';
import { object, bool, func } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  Avatar,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
} from '@material-ui/core';
import {
  Person as PersonIcon,
  AccountBox as AccountBoxIcon,
  ExitToApp as ExitToAppIcon,
} from '@material-ui/icons';
import { NavLink } from 'react-router-dom';
import MicrophoneMenuItem from './MicrophoneMenuItem';

ProfileDropdown.propTypes = {
  user: object.isRequired,
  loading: bool.isRequired,
  onLogout: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main),
  },
}));

function ProfileDropdown({ user, loading, onLogout }) {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const classes = useStyles();

  const handleClickAvatar = e => {
    setMenuAnchor(e.currentTarget);
    setShowProfileMenu(show => !show);
  };

  const handleCloseMenu = () => {
    setShowProfileMenu(false);
  };

  const handleClickLogout = () => {
    onLogout();
  };

  const userInitials = user
    .displayName
    .split(' ')
    .map((name) => name[0])
    .join('');

  return (
    <React.Fragment>
      <Avatar
        aria-controls="profile-menu"
        alt={user.displayName || user.email}
        src={user?.avatarUrl}
        className={classes.avatar}
        onClick={handleClickAvatar}
      >
        {userInitials || <PersonIcon />}
      </Avatar>
      <Menu
        id="profile-menu"
        anchorEl={menuAnchor}
        keepMounted
        open={showProfileMenu}
        onClose={handleCloseMenu}
      >
        <MenuItem component={NavLink} to="/profile">
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MicrophoneMenuItem />
        <MenuItem disabled={loading} onClick={handleClickLogout}>
          <ListItemIcon>
            {loading
              ? <CircularProgress />
              : <ExitToAppIcon />
            }
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default ProfileDropdown;
