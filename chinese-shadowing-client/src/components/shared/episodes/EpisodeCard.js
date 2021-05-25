import React from 'react';
import { instanceOf } from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import Episode from '@models/Episode';
import DifficultyAvatar from './DifficultyAvatar';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardMedia } from '@material-ui/core';

const useStyles = makeStyles({
  difficulty: {
    float: 'right',
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
});

EpisodeCard.propTypes = {
  episode: instanceOf(Episode).isRequired,
};

/**
 * @param {{ episode: Episode }} props
 */
function EpisodeCard({ episode }) {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        avatar={(
          <DifficultyAvatar>
            {episode.difficulty}
          </DifficultyAvatar>
        )}
        title={episode.title}
      />
      <Link to={`/episode/${episode.urlTitle}`}>
        <CardMedia
          className={classes.media}
          image={episode.thumbnailUrl}
          title={episode.title}
        />
      </Link>
    </Card>
  )
}

export default React.memo(EpisodeCard);
