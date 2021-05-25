import Series from '@/models/Series';
import { methods, request } from '@store/request';

// State
const initialState = {
  loading: false,
  series: [],
};

// Selectors

export const selectLoading = (state) => state.series.loading;

export const selectSeries = (state) => state.series.series;

export const selectSeriesById = (state, id) =>
  selectSeries(state).find((s) => s.id === id);

export const selectSeriesByTitle = (state, urlTitle) =>
  selectSeries(state).find(
    (s) => s.urlTitle.toLowerCase() === urlTitle.toLowerCase()
  );

// Thunks
export const fetchSeries = () => async dispatch => {
  const response = await dispatch(request({
    url: '/api/series',
    onError(e) {
      console.error(e);
      throw e;
    },
  }));

  const allSeries = response.data.map(s => new Series(s));
  dispatch(setSeries(allSeries));
};

export const saveVideo = video => async dispatch => {
  const formData = new FormData();
  formData.append('video', video);

  const response = await dispatch(request({
    url: '/api/series/save-video',
    method: methods.POST,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    errorMessage: 'Failed to save video.',
  }));

  return response?.data;
}

export const createSeries = (videoId, title, episodes, personas) => async dispatch => {
  const response = await dispatch(request({
    url: `/api/series`,
    method: methods.POST,
    data: {
      videoId,
      title,
      episodes,
      personas,
    },
    loadingAction: loading,
    errorMessage: 'Failed to create series.',
  }));

  if (response instanceof Error) return;

  dispatch(fetchSeries());
};

// Types
const
  LOADING = '@series/loading',
  SET_SERIES = '@series/setSeries';

// Pure Actions
export const loading = isLoading => ({
  type: LOADING,
  payload: isLoading,
});

export const setSeries = series => ({
  type: SET_SERIES,
  payload: series,
});

// Reducers
export default function seriesReducer(state = initialState, { type, payload  }) {
  switch (type) {
    case LOADING:
      return {
        ...state,
        loading: payload,
      };
    case SET_SERIES:
      return {
        ...state,
        series: payload,
      };
    default:
      return state;
  }
};
