// Thunks

export const success = (config) => dispatch => {
  dispatch(_toast({
    severity: 'success',
    ...config,
  }));
};

export const error = (config) => dispatch => {
  dispatch(_toast({
    severity: 'error',
    ...config,
  }));
};

export const info = (config) => dispatch => {
  dispatch(_toast({
    severity: 'info',
    ...config,
  }));
};

export const warning = (config) => dispatch => {
  dispatch(_toast({
    severity: 'warning',
    ...config,
  }));
};

const _toast = ({ duration = 6000, ...config }) => (dispatch, getState) => {
  dispatch(addSnack({
    duration,
    ...config,
  }));
};

// Types

const
  ADD_SNACK = '@snackbar/addSnack',
  POP_SNACK = '@snackbar/popSnack';

// Pure Actions

export const addSnack = snack => ({
  type: ADD_SNACK,
  payload: snack,
});

export const popSnack = () => ({
  type: POP_SNACK,
});

// Reducers

const initialState = {
  snacks: [],
  snack: null,
};

export default function snackbarReducer(state = initialState, { type, payload  }) {
  switch (type) {
    case ADD_SNACK:
      return {
        ...state,
        snacks: [
          ...state.snacks,
          payload,
        ],
        snack: !!state.snack ? state.snack : payload,
      };
    case POP_SNACK:
      return {
        ...state,
        snacks: state.snacks.slice(1),
        snack: state.snacks[1] || null,
      };
    default:
      return state;
  }
};

// Selectors

export const selectSnack = state => state.snackbar.snack;
