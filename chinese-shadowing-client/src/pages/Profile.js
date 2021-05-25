import React from 'react';

import PrimaryLayout from '@layouts/PrimaryLayout';
import Profile from '@/components/Profile';

function ProfilePage() {
  return (
    <PrimaryLayout title="Profile">
      <Profile />
    </PrimaryLayout>
  );
}

export default ProfilePage;
