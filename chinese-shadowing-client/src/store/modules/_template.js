import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { methods, request } from '@store/request';

// Thunks
export const _ = createAsyncThunk(
  '',
  async (_, { dispatch, rejectWithValue }) => {
    const response = await dispatch(request({
      url: '',
      method: methods.GET,
    }));

    if (response instanceof Error) {
      return rejectWithValue(response);
    }

    return response.data;
  }
)

// Slice
const slice = createSlice({
  name: '',
  initialState: {
    loading: false,
  },
  reducers: {
    loading(state, { payload }) {
      state.loading = payload;
    },
  },
  extraReducers: {},
});

// Selectors

// Reducers
export default slice.reducer;
