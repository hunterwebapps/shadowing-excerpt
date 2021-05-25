import React from 'react';

import { Field } from 'formik';
import { Checkbox, FormControlLabel } from '@material-ui/core';

export default function CheckBox({
  id,
  name,
  label,
  ...rest
}) {
  return (
    <Field name={name}>
      {({ field, meta }) => (
        <FormControlLabel
          label={label}
          control={
            <Checkbox
              id={id || name}
              name={name}
              {...field}
              {...rest}
            />
          }
        />
      )}
    </Field>
  )
}

export { CheckBox };
