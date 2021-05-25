import React from 'react';
import { useParams } from 'react-router';

import PrimaryLayout from '@/components/layouts/PrimaryLayout';
import EpisodeCatalog from '@/components/EpisodeCatalog/EpisodeCatalog';

export default function Episodes() {
  const { seriesTitle } = useParams();

  return (
    <PrimaryLayout>
      <EpisodeCatalog urlTitle={seriesTitle} />
    </PrimaryLayout>
  );
}
