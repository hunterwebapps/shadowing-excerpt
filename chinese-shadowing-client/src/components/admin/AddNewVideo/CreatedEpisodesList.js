import React from 'react';

import {
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';

function CreatedEpisodesList({ episodes }) {
  return (
    <Card>
      <CardContent>
        <List dense>
          {episodes.map((episode, index) => (
            <ListItem key={episode.title}>
              <ListItemAvatar>
                <Avatar>{index+1}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={episode.title}
                secondary={`${episode.start} --> ${episode.end}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default React.memo(CreatedEpisodesList);
