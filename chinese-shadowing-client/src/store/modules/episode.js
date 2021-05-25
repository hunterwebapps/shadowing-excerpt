import { methods, request } from '@store/request';
import { selectSeries } from './series';

// State
const initialState = {
  favoriteIds: [],
  loading: false,
};

// Selectors
export const selectEpisodes = (state) => {
  const allSeries = selectSeries(state);
  return allSeries.flatMap(s => s.episodes);
}

export const selectEpisodeByUrlTitle = (state, urlTitle) =>
  selectEpisodes(state).find(
    (e) => e.urlTitle.toLowerCase() === urlTitle.toLowerCase()
  );

export const selectFavoriteIds = (state) => state.episode.favoriteIds;

// Thunks
export const fetchFavorites = () => async dispatch => {
  const response = await dispatch(request({
    url: '/api/favorites',
    method: methods.GET,
  }));

  if (response instanceof Error) {
    throw response;
  }

  dispatch(setFavorites(response.data));
};

export const toggleFavorited = episodeId => async dispatch => {
  const response = await dispatch(request({
    url: '/api/favorites/toggle',
    params: { episodeId },
    method: methods.GET,
    loadingAction: setLoading,
    errorMessage: 'Failed to save episode.',
    successMessage: 'Saved',
  }));

  if (response instanceof Error) return;

  if (response.data) {
    dispatch(addFavorite(episodeId));
  } else {
    dispatch(removeFavorite(episodeId));
  }
};

// Types
const SET_LOADING = '@episode/setLoading';
const SET_FAVORITES = '@episode/setFavorites';
const ADD_FAVORITE = '@episode/addFavorite';
const REMOVE_FAVORITE = '@episode/removeFavorite';

// Pure Actions
const setLoading = loading => ({
  type: SET_LOADING,
  payload: loading,
});

const setFavorites = favoriteIds => ({
  type: SET_FAVORITES,
  payload: favoriteIds,
});

const addFavorite = episodeId => ({
  type: ADD_FAVORITE,
  payload: episodeId,
});

const removeFavorite = episodeId => ({
  type: REMOVE_FAVORITE,
  payload: episodeId,
});

// Reducers
export default function episodeReducer(state = initialState, { type, payload  }) {
  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
      };
    case SET_FAVORITES:
      return {
        ...state,
        favoriteIds: payload,
      };
    case ADD_FAVORITE:
      return {
        ...state,
        favoriteIds: [
          ...state.favoriteIds,
          payload,
        ],
      };
    case REMOVE_FAVORITE:
      return {
        ...state,
        favoriteIds: state.favoriteIds.filter(id => id !== payload),
      };
    default:
      return state;
  }
};
