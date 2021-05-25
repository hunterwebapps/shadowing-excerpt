import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { methods, request } from '@store/request';
import { getState, setState } from '@/store/caching';
import { selectActiveRoomId } from './room';

// Thunks
export const enumerateMicrophones = createAsyncThunk(
  'shadowing/enumerateMicrophones',
  async (_, { dispatch, getState }) => {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const microphones = devices.filter(d =>
      d.kind === 'audioinput' &&
      !['default', 'communications'].includes(d.deviceId)
    );

    dispatch(setMicrophones(microphones));

    const activeMicrophoneId = selectActiveMicrophoneId(getState());

    const hasActiveMicrophone = microphones.some(
      m => m.deviceId === activeMicrophoneId
    );

    if (!hasActiveMicrophone) {
      dispatch(setActiveMicrophoneId(microphones[0].deviceId));
    }
  }
);

export const fetchShadows = createAsyncThunk(
  'shadowing/fetchShadows',
  async (roomId, { dispatch, rejectWithValue }) => {
    const result = await dispatch(request({
      url: `/api/shadows/${roomId}`,
      method: methods.GET,
      loadingAction: slice.actions.setLoading,
      errorMessage: 'Failed to Fetch Shadows',
    }));

    if (result instanceof Error) {
      return rejectWithValue(result);
    }

    return result.data;
  }
);

export const createShadow = createAsyncThunk(
  'shadowing/createShadow',
  async (shadowModel, { dispatch, rejectWithValue }) => {
    const formData = new FormData();
    formData.append('recording', shadowModel.recording);
    formData.append('sectionId', shadowModel.sectionId)
    formData.append('roomId', shadowModel.roomId);

    const recordingResult = await dispatch(request({
      url: '/api/shadows/recording',
      data: formData,
      method: methods.POST,
      headers: { 'Content-Type': 'multipart/form-data' },
      errorMessage: 'Failed to Save Shadow',
    }));

    if (recordingResult instanceof Error) {
      return rejectWithValue(recordingResult);
    }

    delete shadowModel.recording;
    shadowModel.recordingUrl = recordingResult.data;

    const shadowResult = await dispatch(request({
      url: '/api/shadows',
      data: shadowModel,
      method: methods.POST,
      errorMessage: 'Failed to Save Shadow',
    }));

    if (shadowResult instanceof Error) {
      return rejectWithValue(shadowResult);
    }

    return shadowResult.data;
  },
)

// Slice
const slice = createSlice({
  name: 'shadowing',
  initialState: {
    loading: false,
    microphones: [],
    activeMicrophoneId: getState('activeMicrophoneId', null),
    shadows: [],
  },
  reducers: {
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setMicrophones(state, { payload }) {
      state.microphones = payload;
    },
    setActiveMicrophoneId(state, { payload }) {
      setState(state, 'activeMicrophoneId', payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchShadows.fulfilled, (state, { payload }) => {
        state.shadows = payload;
      })
      .addCase(createShadow.fulfilled, (state, { payload }) => {
        state.shadows.push(payload);
      });
  },
});

// Selectors
export const selectShadowsLoading = state => state.shadowing.loading;

export const selectMicrophones = state => state.shadowing.microphones;

export const selectActiveMicrophoneId = state => state.shadowing.activeMicrophoneId;

export const selectActiveRoomShadows = state => {
  const activeRoomId = selectActiveRoomId(state);
  return state.shadowing.shadows.filter(x => x.roomId === activeRoomId);
};

// Actions
export const {
  setLoading,
  setMicrophones,
  setActiveMicrophoneId,
} = slice.actions;

// Reducer
export default slice.reducer;
