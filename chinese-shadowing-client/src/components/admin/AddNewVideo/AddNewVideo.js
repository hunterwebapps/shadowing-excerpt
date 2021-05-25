import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { SubtitlesCollection } from '@models/videos/Subtitles';
import Episode from '@models/videos/Episode';
import { Form, withFormik } from 'formik';
import * as Yup from 'yup';
import {
  createSeries,
  saveVideo,
  selectLoading,
  selectSeries,
} from '@store/series';

import FileUpload from '@controls/FileUpload';
import TextBox from '@controls/TextBox';
import Button from '@controls/Button';
import ReactPlayer from 'react-player';
import EpisodeMaker from './EpisodeMaker';
import PersonaMaker from './PersonaMaker';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import CreatedEpisodesList from './CreatedEpisodesList';

const useStyles = makeStyles((theme) => ({
  subtitleUpload: {
    marginRight: theme.spacing(1),
  },
}));

const mapStateToProps = state => ({
  series: selectSeries(state),
  loading: selectLoading(state),
});

const mapDispatchToProps = {
  saveVideo,
  createSeries,
};

function AddNewVideo({
  saveVideo,
  loading,
  values,
  setFieldValue,
  touched,
  errors,
}) {
  const [savingVideo, setSavingVideo] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [subtitlesUrl, setSubtitlesUrl] = React.useState(null);
  /** @type {[SubtitlesCollection, Function]} */
  const [subtitles, setSubtitles] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const [isPlaying, setPlaying] = React.useState(false);
  const [editingRange, setEditingRange] = React.useState([-Infinity, Infinity]);

  React.useEffect(() => () => {
    window.URL.revokeObjectURL(subtitlesUrl);
    // eslint-disable-next-line
  }, []);

  const playerRef = React.useRef();

  const classes = useStyles();

  /** @type {import('react-player').Config} */
  const videoConfig = React.useMemo(() => ({
    file: {
      tracks: [{
        label: 'English',
        kind: 'subtitles',
        srcLang: 'en',
        src: subtitlesUrl,
        default: true,
      }],
    },
  }), [subtitlesUrl]);

  const handleChangeVideo = async (e) => {
    if (e.target.files.length === 0) return;

    setSavingVideo(true);

    const file = e.target.files[0];
    const videoId = await saveVideo(file);
    setFieldValue('videoId', videoId);

    setSavingVideo(false);

    const url = `https://hunterwebapps.blob.core.windows.net/videos/${videoId}.mp4`;
    setVideoUrl(url);

    setPlaying(true);
  };

  const handleChangeSubtitles = async (e) => {
    if (e.target.files.length === 0) return;

    const blob = new Blob([e.target.files[0]], { type: 'text/vtt' });
    const url = window.URL.createObjectURL(blob);
    setSubtitlesUrl(url);

    // TODO: Use setFieldValue and do a proper resetForm.

    const text = await blob.text();
    const subtitles = new SubtitlesCollection(text);
    setSubtitles(subtitles);
  };

  const handleReadyVideo = (player) => {
    setDuration(player.getDuration());
  };

  const handleEditEpisode = (thumbnail, range) => {
    if (range[0] === editingRange[0] && range[1] === editingRange[1]) {
      playerRef.current.seekTo(thumbnail);
    } else if (range[0] !== editingRange[0]) {
      playerRef.current.seekTo(range[0]);
      if (!isPlaying) setPlaying(true);
    } else if (range[1] !== editingRange[1]) {
      playerRef.current.seekTo(range[1]);
    }

    setEditingRange(range)
  };

  const handleSaveEpisode = ({ title, thumbnail, range, difficulty, sections }) => {
    const newEpisode = new Episode(title, thumbnail, range, difficulty, sections);
    setFieldValue('episodes', [...values.episodes, newEpisode])
  };

  const handlePlayerProgress = ({ playedSeconds }) => {
    if (playedSeconds >= editingRange[1]) {
      setPlaying(false);
    }
  };

  const handlePlayerPause = () => {
    setPlaying(false);
  };

  const handlePlayerPlay = () => {
    if (playerRef.current.getCurrentTime() >= editingRange[1]) {
      playerRef.current.seekTo(editingRange[0]);
    }
    setPlaying(true);
  };

  const handleSubmitPersona = persona => {
    setFieldValue('personas', [...values.personas, persona]);
  };

  const handleDeletePersona = personaId => {
    setFieldValue('personas', values.personas.filter(p => p.id !== personaId));
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Form>
                <Grid container spacing={3}>
                  {(!subtitles || !videoUrl) && (
                    <React.Fragment>
                      <Grid item xs={12}>
                        <FileUpload
                          accept=".vtt"
                          id="upload-subtitles"
                          className={classes.subtitleUpload}
                          onChange={handleChangeSubtitles}
                          disabled={!!subtitles}
                        >
                          Subtitles
                        </FileUpload>
                        <FileUpload
                          accept="video/mp4"
                          id="upload-video"
                          onChange={handleChangeVideo}
                          loading={savingVideo}
                          disabled={!subtitles}
                        >
                          Video
                        </FileUpload>
                        {touched.videoId && errors.videoId && (
                          <Typography variant="caption" color="error" component="div">
                            Video Required
                          </Typography>
                        )}
                      </Grid>
                    </React.Fragment>
                  )}
                  <Grid item xs={8}>
                    <TextBox id="title" label="Series Title" />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      loading={loading}
                    >
                      Save Series
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            </CardContent>
          </Card>
        </Grid>

        {values.episodes.length > 0 && (
          <Grid item xs={12}>
            <CreatedEpisodesList episodes={values.episodes} />
          </Grid>
        )}

        {subtitles && videoUrl && (
          <React.Fragment>
            <Grid item xs={12}>
              <PersonaMaker
                personas={values.personas}
                onDelete={handleDeletePersona}
                onSubmit={handleSubmitPersona}
              />
            </Grid>

            <Grid item xs={12}>
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={isPlaying}
                onReady={handleReadyVideo}
                width="100%"
                height="100%"
                progressInterval={50}
                controls
                config={videoConfig}
                onProgress={handlePlayerProgress}
                onPlay={handlePlayerPlay}
                onPause={handlePlayerPause}
              />
            </Grid>

            <Grid item xs={12}>
              <EpisodeMaker
                duration={duration}
                episodes={values.episodes}
                subtitles={subtitles}
                personas={values.personas}
                onEdit={handleEditEpisode}
                onSave={handleSaveEpisode}
              />
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    </React.Fragment>
  );
}

const AddNewVideoWithFormik = withFormik({
  mapPropsToValues: () => ({
    videoId: '',
    title: '',
    episodes: [],
    personas: [],
  }),
  enableReinitialize: true,
  validationSchema: props => Yup.object().shape({
    videoId: Yup.string().required('Required'),
    title: Yup
      .string()
      .test({
        name: 'titleExists',
        message: 'Title Already Exists',
        test: value => !props.series.some(
          e => e.title.toLowerCase() === value?.toLowerCase()
        ),
      })
      .required('Required'),
    episodes: Yup
      .array()
      .min(1, 'Minimum 1 Episode Required')
      .required('Required'),
    personas: Yup
      .array()
      .min(1, 'Persona\'s Required')
      .required('Required'),
  }),
  validateOnMount: true,
  handleSubmit: (values, bag) => {
    bag.props.createSeries(
      values.videoId,
      values.title,
      values.episodes,
      values.personas
    );
  },
})(AddNewVideo);

export default connect(mapStateToProps, mapDispatchToProps)(AddNewVideoWithFormik);
