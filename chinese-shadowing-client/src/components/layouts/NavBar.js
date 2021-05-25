import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Collapse,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  active: {
    backgroundColor: theme.palette.action.selected,
  },
}));

function NavBar() {
  const [showSubMenu, setShowSubMenu] = React.useState({});

  const classes = useStyles();

  const handleShowSubMenu = text => {
    setShowSubMenu(show => ({
      ...show,
      [text]: !show[text],
    }));
  };

  const items = [
    {
      to: '/',
      text: 'Home',
    },
    {
      text: 'Management',
      subItems: [
        {
          to: '/management/create-series',
          text: 'Create Series',
        },
        {
          to: '/management/episodes',
          text: 'Manage Episodes',
        },
      ],
    },
  ]

  function LinkListItem({ to, text }) {
    return (
      <ListItem
        button
        component={NavLink}
        to={to}
        exact
        activeClassName={classes.active}
      >
        <ListItemText primary={text} />
      </ListItem>
    );
  }

  function DropdownListItem({ text, subItems }) {
    return (
      <React.Fragment>
        <ListItem button onClick={() => handleShowSubMenu(text)}>
          <ListItemText primary={text} />
          {showSubMenu[text]
            ? <ExpandLessIcon />
            : <ExpandMoreIcon />
          }
        </ListItem>
        <Collapse in={showSubMenu[text]} appear>
          <List>
            <ListMenu items={subItems} />
          </List>
        </Collapse>
      </React.Fragment>
    );
  }

  function ListMenu({ items }) {
    return items.map(item => item.subItems
      ? (
        <DropdownListItem
          key={item.text}
          text={item.text}
          subItems={item.subItems}
        />
      )
      : <LinkListItem key={item.text} to={item.to} text={item.text} />
    );
  }

  return (
    <List component="nav">
      <ListMenu items={items} />
    </List>
  );
}

export default NavBar;
