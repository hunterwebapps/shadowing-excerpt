import React from 'react';
import { connect } from 'react-redux';
import {
  selectActiveMicrophoneId,
  selectMicrophones,
  setActiveMicrophoneId,
} from '@store/shadowing';

import { ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { Mic as MicIcon } from '@material-ui/icons';

const mapStateToProps = state => ({
  activeMicrophoneId: selectActiveMicrophoneId(state),
  microphones: selectMicrophones(state),
});

const mapDispatchToProps = {
  setActiveMicrophoneId,
};

/**
 * @param {{ microphones: MediaDeviceInfo[] }} props
 */
function MicrophoneMenuItem({
  microphones,
  activeMicrophoneId,
  setActiveMicrophoneId,
}) {
  const [show, setShow] = React.useState(false);
  const [microphoneMenuAnchor, setMicrophoneMenuAnchor] = React.useState(null);

  const handleClickMicrophones = e => {
    setMicrophoneMenuAnchor(e.currentTarget);
    setShow(show => !show);
  };

  const handleCloseMicrophoneMenu = () => {
    setShow(false);
  };

  const handleSelect = deviceId => () => {
    setActiveMicrophoneId(deviceId);
  };

  if (!microphones) return null;

  return (
    <MenuItem onClick={handleClickMicrophones}>
      <ListItemIcon>
        <MicIcon />
      </ListItemIcon>
      <ListItemText primary="Microphone" />
      <Menu
        id="microphone-menu"
        anchorEl={microphoneMenuAnchor}
        keepMounted
        open={show}
        onClose={handleCloseMicrophoneMenu}
      >
        {microphones.map(microphone => (
          <MenuItem
            key={microphone.deviceId}
            selected={microphone.deviceId === activeMicrophoneId}
            onClick={handleSelect(microphone.deviceId)}
          >
            <ListItemText primary={microphone.label} />
          </MenuItem>
        ))}
      </Menu>
    </MenuItem>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MicrophoneMenuItem);
