import React from 'react';
import { func } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  SpeedDial as MuiSpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@material-ui/lab';
import {
  CancelPresentation as CancelPresentationIcon,
  ExitToApp as ExitToAppIcon,
} from '@material-ui/icons';

SpeedDial.propTypes = {
  onBack: func.isRequired,
  onCancel: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function SpeedDial({ onBack, onCancel }) {
  const [openDial, setOpenDial] = React.useState(false);

  const classes = useStyles();

  const handleToggleDial = (open) => () => {
    setOpenDial(open);
  };

  return (
    <MuiSpeedDial
      ariaLabel="Shadowing Actions"
      open={openDial}
      icon={<SpeedDialIcon />}
      className={classes.speedDial}
      onOpen={handleToggleDial(true)}
      onClose={handleToggleDial(false)}
    >
      <SpeedDialAction
        icon={<ExitToAppIcon />}
        tooltipTitle="Details"
        tooltipOpen
        onClick={onBack}
      />
      <SpeedDialAction
        icon={<CancelPresentationIcon />}
        tooltipTitle="Cancel"
        tooltipOpen
        onClick={onCancel}
      />
    </MuiSpeedDial>
  );
}

export default SpeedDial;
