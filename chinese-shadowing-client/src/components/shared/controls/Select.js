import React from 'react';

import { Field } from 'formik';
import {
  InputLabel,
  FormControl,
  FormHelperText,
  Select as MuiSelect,
} from '@material-ui/core';

function Select(
  {
    id,
    name,
    label,
    children,
    disabled = false,
    fullWidth = true,
    ...rest
  },
  ref
) {
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
            <MuiSelect
              ref={ref}
              id={id}
              error={showError}
              style={{ width: fullWidth ? '100%' : 'auto' }}
              {...field}
              {...rest}
            >
              {children}
            </MuiSelect>
            {showError && <FormHelperText>{meta.error}</FormHelperText>}
          </FormControl>
        );
      }}
    </Field>
  );
}

export default React.forwardRef(Select);
