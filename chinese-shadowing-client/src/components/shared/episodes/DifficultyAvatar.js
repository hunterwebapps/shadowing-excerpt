import React from 'react';
import { oneOf } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Difficulty } from '@/models/Episode';

import { Avatar, ClickAwayListener, Tooltip } from '@material-ui/core';

DifficultyAvatar.propTypes = {
  children: oneOf(Object.values(Difficulty)).isRequired,
};

const useStyles = makeStyles(theme => ({
  avatar: props => {
    let bg;
    switch (props.difficulty) {
      case Difficulty.EASY:
        bg = theme.palette.primary.main;
        break;
      case Difficulty.MEDIUM:
        bg = theme.palette.warning.main;
        break;
      case Difficulty.HARD:
        bg = theme.palette.error.main;
        break;
      default:
        throw new Error('Invalid Difficulty');
    }

    const text = theme.palette.getContrastText(bg);

    return {
      color: text,
      backgroundColor: bg,
    };
  },
}));

function DifficultyAvatar({ children }) {
  const [open, setOpen] = React.useState(false);

  const classes = useStyles({ difficulty: children });

  const handleShowTooltip = () => {
    setOpen(true);
  };

  const handleHideTooltip = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleHideTooltip}>
      <Tooltip
        PopperProps={{ disablePortal: true }}
        title={children}
        open={open}
        onClose={handleHideTooltip}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        <Avatar className={classes.avatar} onClick={handleShowTooltip}>
          {children[0]}
        </Avatar>
      </Tooltip>
    </ClickAwayListener>
  )
}

export default DifficultyAvatar;
