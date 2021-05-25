// eslint-disable-next-line
import axios, { AxiosResponse } from 'axios';
import { apiUrl } from '@config';
import { success, error } from './snackbar';
import { push, getLocation } from 'connected-react-router';

const xhrClient = axios.create({
  baseURL: apiUrl,
  headers: {},
  withCredentials: true,
});

export const methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DEL: 'DELETE',
};

// Thunks

export const request = ({
  loadingAction = () => ({ type: null }),
  errorMessage = 'Request failed. Please try again.',
  successMessage = null,
  headers = {},
  ...config
}) => async (dispatch, getState) => {
  validateConfig(config);

  config.headers = {
    ...headers,
  };

  dispatch(loadingAction(true));

  /** @type {AxiosResponse} */
  const result = await xhrClient.request(config).catch(err => err);

  dispatch(loadingAction(false));

  if (result instanceof Error) {
    if (result.response?.status === 401) {
      dispatch(push({
        pathname: '/login',
        state: { from: getLocation(getState()) },
      }));
    } else {
      dispatch(_handleError({
        error: result,
        message: errorMessage,
      }));

      console.error(result);
    }

    return result;
  }

  if (successMessage) {
    dispatch(success({
      message: successMessage,
    }));
  }

  return result;
};

const _handleError = ({ error: errorObj, message }) => dispatch => {
  // TODO: Toast message and log app insights error.
  dispatch(error({ message }));
};

// Types

// Pure Actions

// Reducer

const initialState = {

};

export default function requestReducer(state = initialState, { type, payload  }) {
  switch (type) {
    default:
      return state;
  }
};

// Selectors



function validateConfig(config) {
  if (!config) throw new Error('Config object not provided.');

  if (!config.url) throw new Error('No url provided in request config.');
};
