import React from 'react';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import {
  ReactPlugin,
  AppInsightsContext,
  AppInsightsErrorBoundary,
  useAppInsightsContext,
} from '@microsoft/applicationinsights-react-js';
import { history } from '@/store';
import { appInsightsInstrumentationKey } from '@/config';

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: appInsightsInstrumentationKey,
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history },
    },
  },
});

appInsights.loadAppInsights();

function AppInsightsProvider({ children }) {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <AppInsightsErrorBoundary appInsights={reactPlugin} onError={() => children}>
        {children}
      </AppInsightsErrorBoundary>
    </AppInsightsContext.Provider>
  );
}

export default AppInsightsProvider;

export { reactPlugin, appInsights, useAppInsightsContext };
