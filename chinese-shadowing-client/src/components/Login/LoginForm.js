import React from 'react';
import { bool, func } from 'prop-types';
import { Form, withFormik } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';

import TextBox from '@controls/TextBox';
import CheckBox from '@controls/CheckBox';
import Button from '@controls/Button';
import { Link } from 'react-router-dom';

LoginForm.propTypes = {
  loading: bool.isRequired,
  onRegister: func.isRequired,
};

const useStyles = makeStyles({
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  registerLink: {
    textAlign: 'center',
  },
  form: {
    width: '15rem',
  },
});

function LoginForm({ loading, onRegister }) {
  const classes = useStyles();

  return (
    <Form className={classes.form}>
      <TextBox
        name="email"
        label="Email"
        autoFocus
        fullWidth
      />
      <TextBox
        name="password"
        type="password"
        label="Password"
        fullWidth
      />
      <CheckBox
        name="remember"
        label="Remember Me"
      />
      <div className={classes.actions}>
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          loading={loading}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
      <div className={classes.registerLink}>
        <Button color="primary" onClick={onRegister}>
          Register New User
        </Button>
      </div>
    </Form>
  );
}

export default withFormik({
  mapPropsToValues: () => ({
    email: '',
    password: '',
    remember: false,
  }),
  validationSchema: Yup.object().shape({
    email: Yup
      .string()
      .email('Invalid Email')
      .required('Required'),
    password: Yup.string().required('Required'),
    remember: Yup.boolean().required('Required'),
  }),
  handleSubmit: async (values, bag) => {
    const error = await bag.props.onSubmit(values);
    if (!error) return;
    bag.setErrors({ password: error });
  },
})(LoginForm);
