import React from 'react';
import { connect } from 'react-redux';
import { selectRoles, selectUser } from '@store/auth';

import { Route, Redirect } from 'react-router-dom';
import { arrayOf, elementType, string } from 'prop-types';

const mapStateToProps = state => ({
  user: selectUser(state),
  userRoles: selectRoles(state),
});

PrivateRoute.propTypes = {
  path: string.isRequired,
  component: elementType.isRequired,
  roles: arrayOf(string).isRequired,
};

function PrivateRoute({
  component: Component,
  roles,

  user,
  userRoles,

  ...rest
}) {
  return (
    <Route {...rest} render={props => {
      const hasRequiredRole = roles.every((role) => userRoles.includes(role));
      if (!hasRequiredRole) {
        return (
          <Redirect
            to={user.isAnonymous
              ? {
                pathname: '/login',
                state: { from: props.location },
              }
              : {
                pathname: '/403',
              }
            }
          />
        );
      }

      return <Component {...props} />
    }} />
  );
}

export default connect(mapStateToProps, {})(PrivateRoute);
