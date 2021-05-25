import React from 'react';
import { connect } from 'react-redux';
import { login, register, selectLoading } from '@store/auth';
import { useLocation } from 'react-router';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Card, CardContent } from '@material-ui/core';

const mapStateToProps = state => ({
  loading: selectLoading(state),
});

const mapDispatchToProps = {
  login,
  register,
};

function Login({ login, register, loading }) {
  const [showRegister, setShowRegister] = React.useState(false);

  const location = useLocation();

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleShowLogin = () => {
    setShowRegister(false);
  };

  const handleLogin = (credentials) => {
    return login(credentials, location.state?.from);
  };

  const handleRegister = (credentials) => {
    return register(credentials, location.state?.from);
  };

  return (
    <Card>
      <CardContent>
        {showRegister
          ? (
            <RegisterForm
              onSubmit={handleRegister}
              onLogin={handleShowLogin}
              loading={loading}
            />
          ) : (
            <LoginForm
              onSubmit={handleLogin}
              onRegister={handleShowRegister}
              loading={loading}
            />
          )}
      </CardContent>
    </Card>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
