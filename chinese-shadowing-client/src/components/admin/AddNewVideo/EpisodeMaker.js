import React from 'react';
import { arrayOf, func, instanceOf, number } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { SubtitlesCollection } from '@models/videos/Subtitles';
import Episode, { Difficulty } from '@models/videos/Episode';
import Persona from '@models/Persona';
import { Form, withFormik } from 'formik';
import * as Yup from 'yup';

import { Alert } from '@material-ui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Slider,
  Typography,
} from '@material-ui/core';
import TextBox from '@controls/TextBox';
import Select from '@controls/Select';
import Button from '@controls/Button';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import Section from '@/models/videos/Section';

EpisodeMaker.propTypes = {
  duration: number.isRequired,
  episodes: arrayOf(instanceOf(Episode)).isRequired,
  subtitles: instanceOf(SubtitlesCollection).isRequired,
  personas: arrayOf(instanceOf(Persona)).isRequired,
  onEdit: func.isRequired,
  onSave: func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  slider: {
    paddingBottom: '0',
  },
  accordionRoot: {
    display: 'block',
  },
}));

const valueText = (value) => new Date(value * 1000).toISOString().substr(14, 8);

const stepTimestamp = (timestamp, step) => {
  const date = new Date(`1970-01-01T00:${timestamp}Z`);
  date.setMilliseconds(date.getMilliseconds() + step);
  return date.getTime() / 1000;
}

const getStep = (keyCode) => {
  if (keyCode === 38) return 50;
  if (keyCode === 40) return -50;
  return 0;
};

/**
 * @param {{
 *  episodes: Episode[],
 *  personas: Persona[],
 *  subtitles: SubtitlesCollection
 * }} props
 */
function EpisodeMaker({
  duration,
  episodes,
  subtitles,
  personas,
  onEdit,
  values,
  errors,
  touched,
  setFieldValue,
}) {
  const [expanded, setExpanded] = React.useState(null);

  const classes = useStyles();

  React.useEffect(() => {
    const sections = subtitles
      .sliceSubtitles(values.start, values.end)
      .map((s) => new Section(s));

    setFieldValue('sections', sections);
  }, [subtitles, values.start, values.end, setFieldValue]);

  const isOverlapping = React.useMemo(
    () => episodes.some((episode) =>
      (episode.start <= values.start && values.start < episode.end) ||
      (episode.start < values.end && values.end <= episode.end) ||
      (episode.start >= values.start && episode.end < values.end)
    ),
    [episodes, values.start, values.end]
  );

  const handleChangeSlider = (e, [newStart, newEnd]) => {
    const newRange = [newStart, newEnd];
    const newThumbnail = values.thumbnail < newStart
      ? newStart
      : values.thumbnail;
    setFieldValue('start', newStart);
    setFieldValue('end', newEnd);
    setFieldValue('thumbnail', newThumbnail);
    onEdit(newThumbnail, newRange);
  };

  const upDownArrowKeys = [38, 40];
  const handleInputStart = (e) => {
    if (!upDownArrowKeys.includes(e.keyCode)) return;
    const newStart = stepTimestamp(e.target.value, getStep(e.keyCode));
    handleChangeSlider(null, [newStart, values.end]);
  };

  const handleInputEnd = (e) => {
    if (!upDownArrowKeys.includes(e.keyCode)) return;
    const newEnd = stepTimestamp(e.target.value, getStep(e.keyCode));
    handleChangeSlider(null, [values.start, newEnd]);
  };

  const handleInputThumbnail = (e) => {
    if (!upDownArrowKeys.includes(e.keyCode)) return;
    const newThumbnail = stepTimestamp(e.target.value, getStep(e.keyCode));
    setFieldValue('thumbnail', newThumbnail);
    onEdit(newThumbnail, [values.start, values.end]);
  };

  const handleChangeExpandedSection = index => (e, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  const handleSelectPersona = index => e => {
    setFieldValue('personaIds', {
      ...values.personaIds,
      [index]: e.target.value,
    });
  };

  return (
    <Form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="body1">
                Slice Episode
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>

                  {isOverlapping && (
                    <Alert severity="error">
                      Range overlaps with another episode
                    </Alert>
                  )}
                  <Slider
                    value={[values.start, values.end]}
                    max={duration}
                    step={0.05}
                    className={classes.slider}
                    onChange={handleChangeSlider}
                  />

                </Grid>
                <Grid item xs={12}>

                  <TextBox id="title" label="Title" />

                </Grid>
                <Grid item xs={6}>

                  <TextBox
                    id="start"
                    label="Start"
                    value={valueText(values.start)}
                    onKeyDown={handleInputStart}
                  />

                </Grid>
                <Grid item xs={6}>

                  <TextBox
                    id="end"
                    label="End"
                    value={valueText(values.end)}
                    onKeyDown={handleInputEnd}
                  />

                </Grid>
                <Grid item xs={12}>

                  <TextBox
                    id="thumbnail"
                    label="Thumbnail"
                    value={valueText(values.thumbnail)}
                    onKeyDown={handleInputThumbnail}
                  />

                </Grid>
                <Grid item xs={12}>

                  <Select id="difficulty" label="Difficulty">
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value={Difficulty.EASY}>Easy</MenuItem>
                    <MenuItem value={Difficulty.MEDIUM}>Medium</MenuItem>
                    <MenuItem value={Difficulty.HARD}>Hard</MenuItem>
                  </Select>

                </Grid>
                <Grid item xs={12}>

                  <Button type="submit" color="primary" variant="contained">
                    Save Episode
                  </Button>

                  {touched.personaIds && errors.personaIds && (
                    <Typography variant="caption" color="error" component="div">
                      {errors.personaIds}
                    </Typography>
                  )}

                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {values.sections.length > 0 && (
          <Grid item xs={12}>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Configure Sections
              </AccordionSummary>
              <AccordionDetails classes={{ root: classes.accordionRoot }}>
                {values.sections.map((section, index) => (
                  <Accordion
                    key={index}
                    expanded={expanded === index}
                    onChange={handleChangeExpandedSection(index)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {section.text}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Select
                        name={`persona`}
                        label="Persona"
                        value={values.personaIds[index] || ''}
                        onChange={handleSelectPersona(index)}
                      >
                        <MenuItem value="">None</MenuItem>
                        {personas.map(persona => (
                          <MenuItem key={persona.id} value={persona.id}>
                            {persona.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}
      </Grid>
    </Form>
  );
}

export default withFormik({
  mapPropsToValues: props => {
    const lastIndex = props.episodes.length - 1;
    const lastEpisode = props.episodes[lastIndex];
    return {
      title: '',
      start: lastEpisode ? lastEpisode.end : 0,
      end: props.duration,
      thumbnail: 0,
      difficulty: '',
      personaIds: {},
      sections: [],
    };
  },
  enableReinitialize: true,
  validationSchema: props => Yup.object().shape({
    title: Yup
      .string()
      .test({
        name: 'titleExists',
        message: 'Title Already Exists',
        test: value => !props.episodes.some(
          e => e.title.toLowerCase() === value?.toLowerCase()
        ),
      })
      .required('Required'),
    start: Yup.number(),
    end: Yup.number().min(1, 'Required'),
    thumbnail: Yup.number(),
    difficulty: Yup.string().required('Required'),
    personaIds: Yup
      .object()
      .test({
        name: 'personasRequired',
        message: 'Every Section Requires a Persona',
        test(values) {
          return Object.values(values).length === this.parent.sections.length;
        },
      })
      .required('Required'),
    sections: Yup
      .array()
      .required('Required'),
  }),
  handleSubmit: (values, bag) => {
    bag.props.onSave({
      title: values.title,
      thumbnail: values.thumbnail,
      range: [values.start, values.end],
      difficulty: values.difficulty,
      sections: values.sections.map((section, index) => new Section({
        ...section,
        personaId: values.personaIds[index],
      })),
    });
    bag.resetForm();
  },
})(EpisodeMaker);
