import React from 'react';

import PrimaryLayout from '@/components/layouts/PrimaryLayout';
import Browse from '@/components/Browse';

export default function Home() {
  return (
    <PrimaryLayout title="Home Page">
      <Browse />
    </PrimaryLayout>
  );
}
