import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectUser } from '@store/auth';
import { updateAccount, updateUser } from '@store/user';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import PersonalForm from './PersonalForm';
import AccountForm from './AccountForm';
import MyShadows from './MyShadows';
import Settings from './Settings';

const mapStateToProps = state => ({
  user: selectUser(state),
});

const mapDispatchToProps = {
  updateUser,
  updateAccount,
}

const useStyles = makeStyles(theme => ({
  personalFormWrapper: {
    paddingTop: '0',
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
  },
  firstAccordion: {
    '&.MuiAccordion-root:before': {
      display: 'none',
    },
  }
}));

function Profile({ user, updateUser, updateAccount }) {
  const [expanded, setExpanded] = React.useState(null);

  const classes = useStyles();

  const handleChange = (panelName) => (e, isExpanded) => {
    setExpanded(isExpanded ? panelName : false);
  };

  const handleSavePersonal = async user => {
    return updateUser(user);
  };

  const handleSaveAccount = async account => {
    return updateAccount(account);
  };

  return (
    <React.Fragment>

      {/* Personal Info */}
      <Accordion
        expanded={expanded === 'personal'}
        onChange={handleChange('personal')}
        classes={{ root: classes.firstAccordion}}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            Personal Info
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.personalFormWrapper}>
          <PersonalForm user={user} onSave={handleSavePersonal} />
        </AccordionDetails>
      </Accordion>

      {/* Account Details */}
      <Accordion
        expanded={expanded === 'account'}
        onChange={handleChange('account')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            Account Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AccountForm user={user} onSave={handleSaveAccount} />
        </AccordionDetails>
      </Accordion>

      {/* My Shadows */}
      <Accordion
        expanded={expanded === 'shadows'}
        onChange={handleChange('shadows')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            My Shadows
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MyShadows />
        </AccordionDetails>
      </Accordion>

      {/* Settings */}
      <Accordion
        expanded={expanded === 'settings'}
        onChange={handleChange('settings')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Settings />
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
