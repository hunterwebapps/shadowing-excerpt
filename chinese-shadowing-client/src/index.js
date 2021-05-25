import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import './index.css';

import ReduxProvider from '@/providers/ReduxProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import AppInsightsProvider from '@/providers/AppInsightsProvider';
import Router from '@/Router';

ReactDOM.render(
  <ReduxProvider>
    <ThemeProvider>
      <AppInsightsProvider>
        <Router />
      </AppInsightsProvider>
    </ThemeProvider>
  </ReduxProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();

reportWebVitals();
