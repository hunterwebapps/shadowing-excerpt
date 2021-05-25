import React from 'react';

import PrimaryLayout from '@/components/layouts/PrimaryLayout';
import { Typography } from '@material-ui/core';

function Forbidden403() {
  return (
    <PrimaryLayout>
      <Typography variant="h4">
        You're not authorized to access this page.
      </Typography>
    </PrimaryLayout>
  );
}

export default Forbidden403;
