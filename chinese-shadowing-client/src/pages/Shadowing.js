import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';

import PrimaryLayout from '@components/layouts/PrimaryLayout';
import ShadowPlayer from '@components/ShadowPlayer';
import { selectEpisodeByUrlTitle } from '@store/episode';

const mapStateToProps = (state, { match }) => ({
  episode: selectEpisodeByUrlTitle(state, match.params.episodeTitle),
});

function AddVideo({ episode }) {
  const history = useHistory();
  if (!episode) {
    history.push('/404');
    return null;
  }

  return (
    <PrimaryLayout disableGutters>
      <ShadowPlayer episode={episode} />
    </PrimaryLayout>
  );
}

export default connect(mapStateToProps, {})(AddVideo);
