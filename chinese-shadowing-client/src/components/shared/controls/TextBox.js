import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Field } from 'formik';
import {
  Input,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@material-ui/core';

const useStyles = makeStyles({
  input: {
  },
});

function TextBox(
  {
    id,
    name,
    label,
    disabled = false,
    fullWidth = true,
    ...rest
  },
  ref
) {
  const classes = useStyles();

  // May provide either id or name, and it will set the other. Optionally both. At least one is required.
  id = id || name;
  name = name || id;

  if (!name) {
    throw new Error('TextBox "id" or "name" required.');
  }

  return (
    <Field name={name}>
      {({ field, meta }) => {
        const showError = !!meta.error && meta.touched;

        return (
          <FormControl
            error={showError}
            disabled={disabled}
            fullWidth={fullWidth}
          >
            <InputLabel htmlFor={id}>
              {label}
            </InputLabel>
            <Input
              ref={ref}
              id={id}
              error={showError}
              fullWidth={fullWidth}
              className={classes.input}
              {...field}
              {...rest}
            />
            {showError && <FormHelperText>{meta.error}</FormHelperText>}
          </FormControl>
        );
      }}
    </Field>
  )
}

export default React.forwardRef(TextBox);
