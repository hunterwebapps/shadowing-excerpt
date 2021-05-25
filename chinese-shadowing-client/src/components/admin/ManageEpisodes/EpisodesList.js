import React from 'react';
import { arrayOf, instanceOf } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Series from '@models/Series';

import {
  Avatar,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';

EpisodesList.propTypes = {
  series: arrayOf(instanceOf(Series)).isRequired,
};

const useStyles = makeStyles({
  list: {
    width: '100%',
  },
});

/** @param {{ series: Series[] }} props */
function EpisodesList({ series }) {
  const [showSubMenu, setShowSubMenu] = React.useState({});

  const classes = useStyles();

  const handleShowEpisodes = text => {
    setShowSubMenu(show => ({
      ...show,
      [text]: !show[text],
    }));
  };

  return (
    <List dense className={classes.list}>
      {series.map(s => (
        <React.Fragment key={s.id}>
          <ListItem button onClick={() => handleShowEpisodes(s.id)}>
            <ListItemText primary={s.title} />
            {showSubMenu[s.id]
              ? <ExpandLessIcon />
              : <ExpandMoreIcon />
            }
          </ListItem>
          <Collapse in={showSubMenu[s.id]} appear>
            <List>
              {s.episodes.map(episode => (
                <ListItem
                  key={episode.id}
                  button
                  component={Link}
                  to={`/episode/${episode.urlTitle}`}
                >
                  <ListItemAvatar>
                    <Avatar alt={episode.title} src={episode.thumbnailUrl} />
                  </ListItemAvatar>
                  <ListItemText primary={episode.title} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
}

export default EpisodesList;
