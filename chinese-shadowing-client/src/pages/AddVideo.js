import React from 'react';

import PrimaryLayout from '@components/layouts/PrimaryLayout';
import AddNewVideo from '@components/admin/AddNewVideo';

export default function AddVideo() {
  return (
    <PrimaryLayout title="Add Video">
      <AddNewVideo />
    </PrimaryLayout>
  );
}
