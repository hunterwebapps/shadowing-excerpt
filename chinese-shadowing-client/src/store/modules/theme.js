import { createSlice } from '@reduxjs/toolkit';
import { getState, setState } from '../caching';

// Slice
const slice = createSlice({
  name: 'theme',
  initialState: {
    themeType: getState('themeType', 'light'),
  },
  reducers: {
    changeTheme(state, { payload }) {
      setState(state, 'themeType', payload);
    },
  },
  extraReducers: {},
});

// Selectors
export const selectThemeType = state => state.theme.themeType;

// Actions
export const { changeTheme } = slice.actions;

// Reducers
export default slice.reducer;
