import Room from '@/models/Room';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { methods, request } from '@store/request';
import { getState, setState } from '@/store/caching';

// Thunks
export const fetchRooms = createAsyncThunk(
  'room/fetchRooms',
  async (_, { dispatch }) => {
    const response = await dispatch(request({
      url: '/api/rooms',
    }));

    if (response instanceof Error) {
      throw response;
    }

    const rooms = response.data.map(x => new Room(x));

    return rooms;
  }
);

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async ({ episodeId, personaIds }, { dispatch, rejectWithValue }) => {
    const response = await dispatch(request({
      url: '/api/rooms',
      method: methods.POST,
      data: {
        episodeId,
        personaIds
      },
      loadingAction: slice.actions.loading,
      errorMessage: 'Failed to create room.',
    }));

    if (response instanceof Error) {
      return rejectWithValue(response);
    }

    return new Room(response.data);
  },
);

export const cancelRoom = createAsyncThunk(
  'room/cancelRoom',
  async (roomId, { dispatch, rejectWithValue }) => {
    const response = await dispatch(request({
      url: `/api/rooms/cancel/${roomId}`,
      method: methods.DEL,
      loadingAction: slice.actions.loading,
    }));

    if (response instanceof Error) {
      return rejectWithValue(response);
    }

    return new Room(response.data);
  }
);

// Slice
const slice = createSlice({
  name: 'room',
  initialState: {
    loading: false,
    rooms: [],
    activeRoomId: getState('activeRoomId', null),
  },
  reducers: {
    loading(state, { payload }) {
      state.loading = payload;
    },
    continueRoom(state, { payload }) {
      setState(state, 'activeRoomId', payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRooms.fulfilled, (state, { payload }) => {
        state.rooms = payload;
      })
      .addCase(createRoom.fulfilled, (state, { payload }) => {
        state.rooms.push(payload);
        setState(state, 'activeRoomId', payload.id);
      })
      .addCase(cancelRoom.fulfilled, (state, { payload }) => {
        state.rooms = state.rooms.map(x => x.id === payload.id ? payload : x);
        if (state.activeRoomId === payload.id) {
          setState(state, 'activeRoomId', null);
        }
      });
  },
});

// Selectors
export const selectRooms = state => state.room.rooms;

export const selectActiveRoomId = state => state.room.activeRoomId;

export const selectActiveRoom = state => {
  const rooms = selectRooms(state);
  const activeRoomId = selectActiveRoomId(state);
  return rooms.find(x => x.id === activeRoomId);
};

// Actions
export const { loading, continueRoom } = slice.actions;

// Reducer
export default slice.reducer;
