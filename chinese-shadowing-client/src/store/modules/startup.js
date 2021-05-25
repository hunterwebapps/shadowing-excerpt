import { me } from './auth';
import { fetchFavorites } from './episode';
import { fetchRooms } from './room';
import { fetchSeries } from './series';
import { enumerateMicrophones } from './shadowing';

// State
const initialState = {
  loading: false,
  initialized: false,
  initFailed: false,
};

// Selectors
export const selectLoading = (state) => state.startup.loading;

export const selectInitialized = (state) => state.startup.initialized;

export const selectInitFailed = (state) => state.startup.initFailed;

export const selectIntroduction = (state) => state.startup.introduction;

// Thunks
export const init = () => async (dispatch) => {
  dispatch(loading(true));

  await dispatch(me());

  const requiredResults = [
    dispatch(fetchSeries()),
    dispatch(fetchRooms()),
    dispatch(enumerateMicrophones()),
  ];

  Promise.allSettled(requiredResults)
    .then(results => {
      if (results.some(r => r.status === 'rejected')) {
        dispatch(initFailed());
      } else {
        dispatch(initialized(true));
        dispatch(loading(false));
      }
    });

  // TODO: Notify users of non-working features.
  // Optional Results.
  dispatch(fetchFavorites());
};

// Types
const LOADING = '@startup/loading';
const INITIALIZED = '@startup/initialized';
const INIT_FAILED = '@startup/initFailed';

// Pure Actions
const loading = (isLoading) => ({
  type: LOADING,
  payload: isLoading,
});

const initialized = (isInitialized) => ({
  type: INITIALIZED,
  payload: isInitialized,
});

const initFailed = () => ({
  type: INIT_FAILED,
});

// Reducers
export default function startupReducer(state = initialState, { type, payload  }) {
  switch (type) {
    case LOADING:
      return {
        ...state,
        loading: payload,
      };
    case INITIALIZED:
      return {
        ...state,
        initialized: payload,
      };
    case INIT_FAILED:
      return {
        ...state,
        initFailed: true,
      };
    default:
      return state;
  }
};
