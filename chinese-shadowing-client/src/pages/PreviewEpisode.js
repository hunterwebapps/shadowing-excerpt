import React from 'react';
import { arrayOf, instanceOf } from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { selectEpisodeByUrlTitle, selectEpisodes } from '@store/episode';
import Episode from '@models/Episode';

import PrimaryLayout from '@layouts/PrimaryLayout';
import EpisodeDetails from '@/components/EpisodeDetails';
import { Grid, Typography } from '@material-ui/core';
import EpisodeCard from '@/components/shared/episodes/EpisodeCard';

PreviewEpisode.propTypes = {
  episode: instanceOf(Episode).isRequired,
  episodes: arrayOf(instanceOf(Episode)).isRequired,
};

const mapStateToProps = (state, { match }) => ({
  episode: selectEpisodeByUrlTitle(state, match.params.episodeTitle),
  episodes: selectEpisodes(state),
});

const mapDispatchToProps = {};

/**
 * @param {{
 *  episodes: Episode[],
 *  episode: Episode,
 * }} props
 **/
function PreviewEpisode({ episodes, episode }) {
  const history = useHistory();
  if (!episode) {
    history.push('/404');
    return null;
  }

  const relatedEpisodes = episodes.filter(e => e !== episode);
  return (
    <PrimaryLayout title={episode.title}>
      <EpisodeDetails episode={episode} />
      {relatedEpisodes.length > 0 && (
        <React.Fragment>
          <Typography variant="h5" component="h1" gutterBottom>
            Related Episodes
          </Typography>
          <Grid container spacing={3}>
            {relatedEpisodes.map(episode => (
              <Grid key={episode.id} item xs={12}>
                <EpisodeCard episode={episode} />
              </Grid>
            ))}
          </Grid>
        </React.Fragment>
      )}
    </PrimaryLayout>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewEpisode);
