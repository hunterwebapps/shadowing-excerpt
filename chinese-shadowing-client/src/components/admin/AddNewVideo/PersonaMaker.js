import React from 'react';
import { arrayOf, instanceOf, func } from 'prop-types';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import Gender from '@models/enums/Gender';
import Persona from '@models/Persona';

import { Form, withFormik } from 'formik';
import TextBox from '@controls/TextBox';
import Select from '@controls/Select';
import Button from '@controls/Button';
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Typography,
} from '@material-ui/core';

PersonaMaker.propTypes = {
  personas: arrayOf(instanceOf(Persona)).isRequired,
  onSubmit: func.isRequired,
  onDelete: func.isRequired,
};

const useStyles = makeStyles({
  createdList: {
    flexGrow: '1',
  },
});

/**
 * @param {{
 *  personas: Persona[],
 * }} props
 **/
function PersonaMaker({ personas, onDelete }) {
  const classes = useStyles();

  const handleDelete = (personaId) => () => onDelete(personaId);

  return (
    <Card>
      <CardContent>
        <Typography variant="body1">
          Personas
        </Typography>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={6}>

              <TextBox name="name" label="Name" />

            </Grid>
            <Grid item xs={6}>

              <Select name="gender" label="Gender">
                <MenuItem value=""></MenuItem>
                {Gender.toArray().map(gender => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>

            </Grid>
            <Grid item xs={12}>

              <Button type="submit" color="primary" variant="contained">
                Add Persona
              </Button>

            </Grid>

            {personas.length > 0 && (
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    {personas.length} Personas Created
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense className={classes.createdList}>
                      {personas.map(persona => (
                        <ListItem key={persona.id}>
                          <ListItemText
                            primary={persona.name}
                            secondary={persona.gender}
                          />
                          <ListItemSecondaryAction>
                            <Button
                              color="secondary"
                              icon
                              onClick={handleDelete(persona.id)}
                            >
                              <DeleteIcon />
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}
          </Grid>
        </Form>
      </CardContent>
    </Card>
  );
}

export default withFormik({
  mapPropsToValues: () => ({
    name: '',
    gender: Gender.UNSPECIFIED,
  }),
  enableReinitialize: true,
  validationSchema: props => Yup.object().shape({
    name: Yup
      .string()
      .max(50, 'Max 50 Characters')
      .notOneOf(props.personas.map(p => p.name), 'Duplicate Name')
      .required('Required'),
    gender: Yup
      .string()
      .oneOf(Gender.toArray(), 'Invalid Gender')
      .required('Required'),
  }),
  handleSubmit(values, bag) {
    const persona = new Persona({
      id: uuidv4(),
      name: values.name,
      gender: values.gender,
    });

    bag.props.onSubmit(persona);
    bag.resetForm();
  },
})(PersonaMaker);
