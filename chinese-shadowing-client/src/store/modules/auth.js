import { request, methods } from '@store/request';
import { push } from 'connected-react-router';
import { fetchRooms } from './room';

export const Roles = {
  ADMIN: 'Admin',
  USER: 'User',
};

// Thunks

export const me = () => async dispatch => {
  const response = await dispatch(request({
    url: '/api/auth/me',
    errorMessage: 'Failed to load user.',
  }));

  if (response instanceof Error) {
    console.error(response);
    throw response;
  }

  const { roles, ...user } = response.data;
  dispatch(setRoles(roles));
  dispatch(setUser(user));
};

export const login = (credentials, fromLocation = '/') => async dispatch => {
  const result = await dispatch(request({
    url: '/api/auth',
    method: methods.POST,
    data: credentials,
    loadingAction: loading,
    errorMessage: 'Failed to login.',
  }));

  if (result instanceof Error) {
    if (result.response.status === 404) {
      return 'Invalid Username or Password';
    }
    return;
  }

  const { roles, ...user } = result.data;

  dispatch(setRoles(roles));
  dispatch(setUser(user));
  dispatch(fetchRooms());

  dispatch(push(fromLocation));
};

export const logout = () => async dispatch => {
  const response = await dispatch(request({
    url: '/api/auth',
    method: methods.DEL,
    errorMessage: 'Failed to logout.',
  }));

  if (response instanceof Error) return;

  // TODO: Reset state.

  await dispatch(me());
  dispatch(push('/'));
};

export const register = (credentials, fromLocation = '/') => async dispatch => {
  const response = await dispatch(request({
    url: '/api/auth/register',
    method: methods.POST,
    data: credentials,
    loadingAction: loading,
    errorMessage: 'Failed to register.',
  }));

  if (response instanceof Error) return;

  if (response.status === 200) {
    return response.data;
  }

  dispatch(login({
    email: credentials.email,
    password: credentials.password,
    remember: false,
  }, fromLocation));
}

// Types

const
  LOADING = '@auth/loading',
  SET_USER = '@auth/setUser',
  UPDATE_USER_PROPERTIES = '@auth/updateUserProperties',
  SET_ROLES = '@auth/setRoles',
  CLEAR_USER = '@auth/clearUser';

// Pure Actions

export const setUser = user => ({
  type: SET_USER,
  payload: user,
});

export const updateUserProperties = properties => ({
  type: UPDATE_USER_PROPERTIES,
  payload: properties,
});

export const setRoles = roles => ({
  type: SET_ROLES,
  payload: roles,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const loading = isLoading => ({
  type: LOADING,
  payload: isLoading,
});

// Reducer

const initialState = {
  user: null,
  roles: [],
  loading: false,
};

export default function authReducer(state = initialState, { type, payload  }) {
  switch (type) {
    case SET_USER:
      return {
        ...state,
        user: payload,
      };
    case UPDATE_USER_PROPERTIES:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
      };
    case SET_ROLES:
      return {
        ...state,
        roles: payload,
      };
    case CLEAR_USER:
      return {
        ...state,
        user:  null,
        roles: [],
      };
    case LOADING:
      return {
        ...state,
        loading: payload,
      };
    default:
      return state;
  }
};

// Selectors

export const selectUser = state => state.auth.user;

export const selectRoles = state => state.auth.roles;

export const selectLoading = state => state.auth.loading;
