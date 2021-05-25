import { configureStore } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { environment } from '@/config';

import authReducer from './modules/auth';
import startupReducer from './modules/startup';
import themeReducer from './modules/theme';
import requestReducer from './modules/request';
import snackbarReducer from './modules/snackbar';
import seriesReducer from './modules/series';
import episodeReducer from './modules/episode';
import userReducer from './modules/user';
import shadowingReducer from './modules/shadowing';
import roomReducer from './modules/room';

export const history = createBrowserHistory();

const reducer = {
  router: connectRouter(history),
  auth: authReducer,
  startup: startupReducer,
  theme: themeReducer,
  request: requestReducer,
  snackbar: snackbarReducer,
  user: userReducer,
  series: seriesReducer,
  episode: episodeReducer,
  shadowing: shadowingReducer,
  room: roomReducer,
};

const middleware = [
  routerMiddleware(history),
];

const store = configureStore({
  reducer,
  middleware: defaults => [
    ...defaults({ serializableCheck: false }),
    ...middleware,
  ],
  devTools: environment !== 'production',
});

export default store;

