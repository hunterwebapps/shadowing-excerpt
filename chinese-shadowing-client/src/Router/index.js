import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { history } from '@/store';
import { init, selectInitialized } from '@store/startup';
import { Roles } from '@store/auth';

import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import PrivateRoute from './PrivateRoute';
import ScrollToTop from '@components/shared/ScrollToTop';

import Splash from '@pages/Splash';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Episodes from '@pages/Episodes';
import PreviewEpisode from '@/pages/PreviewEpisode';
import Shadowing from '@pages/Shadowing';
import Profile from '@/pages/Profile';
import AddVideo from '@pages/AddVideo';
import ManageEpisodes from '@/pages/ManageEpisodes';
import Forbidden403 from '@pages/Forbidden403';
import NotFound404 from '@/pages/NotFound404';

const mapStateToProps = (state) => ({
  initialized: selectInitialized(state),
});

const mapDispatchToProps = {
  init,
};

function Router({ init, initialized }) {
  useEffect(() => {
    init();
  }, [init]);

  if (!initialized) {
    return <Splash />
  }

  return (
    <ConnectedRouter history={history}>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/login" component={Login} />
        <Route path="/episodes/:seriesTitle" component={Episodes} />
        <Route path="/episode/:episodeTitle" component={PreviewEpisode} />
        <Route path="/shadow/:episodeTitle" component={Shadowing} />
        <PrivateRoute
          path="/profile"
          component={Profile}
          roles={[Roles.USER]}
        />
        <PrivateRoute
          path="/management/create-series"
          component={AddVideo}
          roles={[Roles.ADMIN]}
        />
        <PrivateRoute
          path="/management/episodes"
          component={ManageEpisodes}
          roles={[Roles.ADMIN]}
        />
        <Route path="/403" component={Forbidden403} />
        <Route component={NotFound404} />
      </Switch>
    </ConnectedRouter>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Router);
