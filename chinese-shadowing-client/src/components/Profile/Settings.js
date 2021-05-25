import React from 'react';
import { connect } from 'react-redux';
import { FormLabel, Grid, Switch } from '@material-ui/core';
import { changeTheme, selectThemeType } from '@/store/modules/theme';

const mapStateToProps = state => ({
  themeType: selectThemeType(state),
});

const mapDispatchToProps = {
  changeTheme,
};

function Settings({ themeType, changeTheme }) {
  const handleChangeTheme = e => {
    const themeType = e.target.checked ? 'dark' : 'light';
    changeTheme(themeType);
  };

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={12}>
        <FormLabel>Toggle Theme</FormLabel>
      </Grid>
      <Grid item>Light</Grid>
      <Grid item>
        <Switch
          color="default"
          checked={themeType === 'dark'}
          onChange={handleChangeTheme}
        />
      </Grid>
      <Grid item>Dark</Grid>
    </Grid>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
