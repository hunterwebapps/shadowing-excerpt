import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import Button from './Button';
import { ArrowDropDown as ArrowDropDownIcon } from '@material-ui/icons';

const useStyles = makeStyles({
  buttonWrapper: {
    textAlign: 'center',
  },
});

/**
 * @typedef {object} SplitButtonOption
 * @property {string} text
 * @property {function} onClick
 * */

/** @param {{ options: SplitButtonOption[] }} */
function SplitButton({ options }) {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState(options[0]);

  const anchorRef = React.useRef(null);

  const classes = useStyles();

  const handleClickOption = (option) => (e) => {
    setSelectedOption(option);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div className={classes.buttonWrapper}>
        <ButtonGroup ref={anchorRef} variant="contained" color="primary">
          <Button onClick={selectedOption.onClick}>
            {selectedOption.text}
          </Button>
          <Button color="primary" size="small" onClick={handleToggle}>
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
      </div>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {options.map(option => (
                    <MenuItem
                      key={option.text}
                      selected={option === selectedOption}
                      onClick={handleClickOption(option)}
                    >
                      {option.text}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}

export default SplitButton;
