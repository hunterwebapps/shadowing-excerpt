import React from 'react';
import { connect } from 'react-redux';
import { selectSeriesByTitle } from '@store/series';

import { Typography } from '@material-ui/core';
import EpisodeCard from '@/components/shared/episodes/EpisodeCard';

const mapStateToProps = (state, { urlTitle }) => ({
  series: selectSeriesByTitle(state, urlTitle),
});

const mapDispatchToProps = {
};

function EpisodeCatalog({ series }) {
  return (
    <React.Fragment>
      <Typography variant="h5">
        {series.title}
      </Typography>

      {series.episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EpisodeCatalog);
