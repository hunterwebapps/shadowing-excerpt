import React from 'react';

import PrimaryLayout from '@/components/layouts/PrimaryLayout';
import ManageEpisodes from '@/components/admin/ManageEpisodes';

function ManageEpisodesPage() {
  return (
    <PrimaryLayout title="Manage Episodes">
      <ManageEpisodes />
    </PrimaryLayout>
  );
}

export default ManageEpisodesPage;
