import React from 'react';
import { connect } from 'react-redux';
import {
  createMuiTheme,
  ThemeProvider as MaterialThemeProvider,
} from '@material-ui/core/styles';
import { blueGrey, blue, red, grey, deepOrange } from '@material-ui/core/colors';
/* eslint-disable no-unused-vars */
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
/* eslint-enable no-unused-vars */
import { selectThemeType } from '@store/theme';
import { CssBaseline } from '@material-ui/core';

/** @type {PaletteOptions} */
const lightPalette = {
  type: 'light',

  primary: {
    main: blue[600],
    light: blue[300],
    dark: blue[900],
  },

  secondary: {
    main: blueGrey[400],
    light: blueGrey[100],
    dark: blueGrey[700],
  },

  background: blueGrey,

  error: {
    main: red[600],
  },
};

/** @type {PaletteOptions} */
const darkPalette = {
  type: 'dark',

  primary: {
    main: deepOrange[700],
    light: deepOrange[600],
    dark: deepOrange[800],
  },

  secondary: {
    main: blueGrey[800],
    light: blueGrey[700],
    dark: blueGrey[900],
  },

  background: grey,

  error: {
    main: red[800],
  },
}

/** @type {import('@material-ui/core/styles/overrides').Overrides} */
const overrides = {
  MuiTypography: {
    h4: {
      marginTop: '1rem',
    },
    h5: {
      marginTop: '1rem',
    },
  },
};

const themes = {
  light: createMuiTheme({
    overrides,
    palette: lightPalette,
  }),
  dark: createMuiTheme({
    overrides,
    palette: darkPalette,
  }),
};

const mapStateToProps = state => ({
  themeType: selectThemeType(state),
});

function ThemeProvider({ themeType, children }) {
  return (
    <MaterialThemeProvider theme={themes[themeType]}>
      <CssBaseline />
      {children}
    </MaterialThemeProvider>
  );
};

export default connect(mapStateToProps, {})(ThemeProvider);
