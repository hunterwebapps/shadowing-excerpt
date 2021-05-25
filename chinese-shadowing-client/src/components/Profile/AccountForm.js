import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';

import { Form, withFormik } from 'formik';
import TextBox from '@controls/TextBox';
import { Button, CircularProgress, FormHelperText, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  submit: {
    marginTop: theme.spacing(3),
  },
}));

function AccountForm({ dirty, isSubmitting }) {
  const classes = useStyles();

  return (
    <Form>

      <Grid container>
        <Grid item xs={12}>

          <TextBox name="email" label="Email" />
          <FormHelperText>Changing Your Email Requires Confirmation</FormHelperText>
          <TextBox
            name="currentPassword"
            label="Current Password"
            type="password"
            autoComplete="new-password"
          />

          <TextBox name="newPassword" label="New Password" type="password" />
          <FormHelperText>
            &bull; Minimum 8 Characters<br />
            &bull; At Least 1 Upper and 1 Lowercase<br />
            &bull; At Least 1 Special Character
          </FormHelperText>

          <TextBox
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
          />

        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={!dirty || isSubmitting}
      >
        {isSubmitting && <CircularProgress />}
        Update Account
      </Button>
    </Form>
  );
}

export default withFormik({
  mapPropsToValues: ({ user }) => ({
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  }),
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    email: Yup
      .string()
      .email('Invalid Email')
      .required('Required'),
    currentPassword: Yup.string(),
    newPassword: Yup
      .string()
      .min(8, 'Minimum 8 Characters')
      .matches(/.*[a-z].*/, 'LowerCase Required')
      .matches(/.*[A-Z].*/, 'UpperCase Required')
      .matches(/.*[\W].*/, 'Special Character Required')
      .when('currentPassword', {
        is: currentPassword => currentPassword?.length > 0,
        then: Yup.string().required('Erase Current or Enter New Password'),
      }),
    confirmNewPassword: Yup
      .string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords Must Match'),
  }),
  handleSubmit: async (values, bag) => {
    bag.setSubmitting(true);
    await bag.props.onSave(values);
    bag.setSubmitting(false);
    bag.resetForm();
  },
})(AccountForm);
