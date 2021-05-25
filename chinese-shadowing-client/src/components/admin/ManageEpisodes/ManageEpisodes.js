import React from 'react';
import { connect } from 'react-redux';
import { selectSeries } from '@store/series';

import EpisodesList from './EpisodesList';

const mapStateToProps = state => ({
  series: selectSeries(state),
});

const mapDispatchToProps = {};

function ManageEpisodes({ series }) {
  return (
    <EpisodesList series={series} />
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ManageEpisodes));
