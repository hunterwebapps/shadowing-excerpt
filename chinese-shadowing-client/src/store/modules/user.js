import { methods, request } from '@store/request';
import { updateUserProperties } from './auth';

// State
const initialState = {

};

// Selectors

// Thunks
export const updateUser = user => async dispatch => {
  const response = await dispatch(request({
    url: '/api/users',
    data: user,
    method: methods.PUT,
    loadingAction: loading,
    successMessage: 'User Updated',
    errorMessage: 'Failed to update user.',
  }));

  if (response instanceof Error) return false;

  dispatch(updateUserProperties(response.data));
};

export const updateAccount = account => async dispatch => {
  const response = await dispatch(request({
    url: '/api/auth',
    data: account,
    method: methods.PUT,
    loadingAction: loading,
    successMessage: 'Account Updated',
    errorMessage: 'Failed to update account details.',
  }));

  if (response instanceof Error) return false;

  dispatch(updateUserProperties(response.data));
}

// Types
const LOADING = '@user/loading';

// Pure Actions
const loading = isLoading => ({
  type: LOADING,
  payload: isLoading,
});

// Reducers
export default function userReducer(state = initialState, { type, payload  }) {
  switch (type) {
    default:
      return state;
  }
};
