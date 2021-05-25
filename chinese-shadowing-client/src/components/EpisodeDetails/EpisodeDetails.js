import React from 'react';
import { arrayOf, instanceOf } from 'prop-types';
import { connect } from 'react-redux';
import { selectSeriesById } from '@store/series';
import { makeStyles } from '@material-ui/core/styles';
import Series from '@models/Series';
import Episode from '@models/Episode';
import Room, { RoomState } from '@models/Room';
import { selectFavoriteIds, toggleFavorited } from '@store/episode';
import { continueRoom, createRoom, selectRooms } from '@store/room';

import ReactPlayer from 'react-player';
import DifficultyAvatar from '@shared/episodes/DifficultyAvatar';
import Button from '@controls/Button';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@material-ui/icons';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router';

EpisodeDetails.propTypes = {
  series: instanceOf(Series).isRequired,
  episode: instanceOf(Episode).isRequired,
  rooms: arrayOf(instanceOf(Room)).isRequired,
};

const useStyles = makeStyles(theme => ({
  videoWrapper: {
    paddingTop: '56.25%',
    position: 'relative',
  },
  video: {
    position: 'absolute',
    height: '100% !important',
    width: '100% !important',
    top: '0',
    left: '0',
    '& video': {
      display: 'block',
    },
  },
  shadowBtn: {
    margin: '0 auto',
    display: 'block',
  },
  favorite: {
    color: theme.palette.error.main,
  },
}));

const mapStateToProps = (state, { episode }) => ({
  series: selectSeriesById(state, episode.seriesId),
  favoriteIds: selectFavoriteIds(state),
  rooms: selectRooms(state),
});

const mapDispatchToProps = {
  createRoom,
  continueRoom,
  toggleFavorited,
};

/**
 * @param {{
 *  series: Series,
 *  episode: Episode,
 *  favoriteIds: string[],
 *  rooms: Room[]
 * }} props
 */
function EpisodeDetails({
  series,
  episode,
  favoriteIds,
  rooms,
  createRoom,
  continueRoom,
  toggleFavorited,
}) {
  const [isPlaying, setPlaying] = React.useState(false);
  const [favoriteLoading, setFavoriteLoading] = React.useState(false);
  /** @type {React.LegacyRef<ReactPlayer>} */
  const playerRef = React.useRef();

  const history = useHistory();

  const classes = useStyles();

  const activeRoom = rooms.find(
    x => x.episodeId === episode.id && x.state === RoomState.ACTIVE
  );

  const handleClickPlay = () => {
    setPlaying(true);
  };

  const handleClickPause = () => {
    setPlaying(false);
  };

  const handleClickFavorite = async () => {
    setFavoriteLoading(true);
    await toggleFavorited(episode.id);
    setFavoriteLoading(false);
  };

  const handleClickCreate = async () => {
    const result = await createRoom({
      episodeId: episode.id,
      // TODO: Implement selecting specific persona id(s).
      personaIds: personas.map(p => p.id),
    });
    if (result.payload instanceof Error) {
      // TODO: Handle error (already handled 401, login redirect)
      return;
    }
    history.push(`/shadow/${episode.urlTitle}`);
  };

  const handleClickContinue = () => {
    continueRoom(activeRoom.id);
    history.push(`/shadow/${episode.urlTitle}`);
  };

  const personas = React.useMemo(() => episode.getPersonas(), [episode]);

  const isFavorite = React.useMemo(
    () => favoriteIds.includes(episode.id),
    [favoriteIds, episode]
  );

  const favoritedIcon = isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />;

  return (
    <React.Fragment>
      <Card>
        <CardHeader
          avatar={(
            <DifficultyAvatar>
              {episode.difficulty}
            </DifficultyAvatar>
          )}
          title={episode.title}
          subheader={series.title}
        />
        <CardMedia>
          <div className={classes.videoWrapper}>
            <ReactPlayer
              ref={playerRef}
              className={classes.video}
              playing={isPlaying}
              url={episode.videoUrl}
              light={episode.thumbnailUrl}
              onClickPreview={handleClickPlay}
              onPlay={handleClickPlay}
              onPause={handleClickPause}
              controls
              width="100%"
              height="100%"
            />
          </div>
        </CardMedia>
        <CardContent>
          {activeRoom ? (
            <Button
              color="secondary"
              variant="contained"
              className={classes.shadowBtn}
              onClick={handleClickContinue}
            >
              Continue Shadowing
            </Button>
          ) : (
            <Button
              color="primary"
              variant="contained"
              className={classes.shadowBtn}
              onClick={handleClickCreate}
            >
              Start Shadowing
            </Button>
          )}
          {personas.map(persona => (
            <Typography key={persona.id} variant="body1">
              {persona.name}
            </Typography>
          ))}
        </CardContent>
        <CardActions>
          <Button
            loading={favoriteLoading}
            className={classes.favorite}
            icon
            onClick={handleClickFavorite}
          >
            {favoritedIcon}
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EpisodeDetails);
