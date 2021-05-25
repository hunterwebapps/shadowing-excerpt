import React from 'react';
import { Form, withFormik } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';

import TextBox from '@controls/TextBox';
import Button from '@controls/Button';
import { Link } from 'react-router-dom';
import { FormHelperText } from '@material-ui/core';

const useStyles = makeStyles({
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '0.5rem',
  },
  form: {
    width: '15rem',
  },
});

function RegisterForm({ loading, status, onLogin }) {
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
      <FormHelperText>
        &bull; Minimum 8 Characters<br />
        &bull; At Least 1 Upper and 1 Lowercase<br />
        &bull; At Least 1 Special Character
      </FormHelperText>
      <TextBox
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        fullWidth
      />
      <div className={classes.actions}>
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          loading={loading}
        >
          Register
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
      <div className={classes.loginLink}>
        <Button color="primary" onClick={onLogin}>
          Show Login
        </Button>
      </div>
    </Form>
  );
}

export default withFormik({
  mapPropsToValues: props => ({
    email: '',
    password: '',
    confirmPassword: '',
  }),
  validationSchema: Yup.object().shape({
    email: Yup
      .string()
      .email('Invalid Email')
      .required('Required'),
    password: Yup
      .string()
      .min(8, 'Min 8 Characters')
      .matches(/.*[a-z].*/, 'LowerCase Required')
      .matches(/.*[A-Z].*/, 'UpperCase Required')
      .matches(/.*[\W].*/, 'Special Character Required')
      .required('Required'),
    confirmPassword: Yup
      .string()
      .oneOf([Yup.ref('password'), null], 'Passwords Must Match'),
  }),
  handleSubmit: async (values, bag) => {
    const result = await bag.props.onSubmit(values);
    const errors = {};
    if (result?.includes('DuplicateEmail')) {
      errors.email = 'Email Already Exists';
    } else if (result?.includes('InvalidPassword')) {
      errors.password = 'Password Too Simple';
    }
    bag.setErrors(errors);
  },
})(RegisterForm);
