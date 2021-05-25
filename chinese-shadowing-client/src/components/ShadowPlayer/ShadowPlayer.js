// eslint-disable-next-line
import React, { useEffect, Dispatch, RefObject, memo } from 'react';
import { instanceOf } from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { useAppInsightsContext } from '@/providers/AppInsightsProvider';
import {
  createShadow,
  fetchShadows,
  selectActiveMicrophoneId,
  selectActiveRoomShadows,
  selectShadowsLoading,
} from '@store/shadowing';
import { cancelRoom, selectActiveRoom } from '@store/room';
// eslint-disable-next-line
import Section from '@models/Section';
// eslint-disable-next-line
import Shadow from '@models/Shadow';
import Episode from '@models/Episode';
import Room from '@models/Room';
import { Inferencer, Language } from './speechRecognition';
import { MicRecorder } from './micRecorder';

import { Box, Container, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import ReactPlayer from 'react-player';
import SectionCard from './SectionCard';
import ConfirmDialog from '@shared/feedback/ConfirmDialog';
import SpeedDial from './SpeedDial';
import AudioWarping from './AudioWarping';

ShadowPlayer.propTypes = {
  activeRoom: instanceOf(Room),
  episode: instanceOf(Episode).isRequired,
};

const useStyles = makeStyles(theme => ({
  player: {
    width: '100% !important',
    height: '100% !important',
    position: 'relative',
    boxShadow: `0px 2px 4px -1px rgb(0 0 0 / 20%),
                0px 4px 5px 0px rgb(0 0 0 / 14%),
                0px 1px 10px 0px rgb(0 0 0 / 12%)`,
    '& video': {
      display: 'block',
    },
  },
  sections: {
    paddingBottom: '1rem',
  },
  container: props => ({
    overflow: 'scroll',
    height: `calc(100vh - ${props.playerHeight}px - 56px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${props.playerHeight}px - 64px)`,
    },
  }),
  sectionSkeleton: {
    height: '4rem',
    margin: '1rem 0',
  },
}));

const mapStateToProps = state => ({
  activeRoom: selectActiveRoom(state),
  activeMicrophoneId: selectActiveMicrophoneId(state),
  shadowsLoading: selectShadowsLoading(state),
  shadows: selectActiveRoomShadows(state),
});

const mapDispatchToProps = {
  fetchShadows,
  cancelRoom,
  createShadow,
};

/**
 * @param {{
 *  episode: Episode,
 *  activeRoom: Room,
 *  shadowsLoading: boolean,
 *  shadows: Shadow[],
 * }} props
 */
function ShadowPlayer({
  episode,
  activeRoom,
  shadowsLoading,
  shadows,
  activeMicrophoneId,
  fetchShadows,
  cancelRoom,
  createShadow,
}) {
  const [isReady, setReady] = React.useState(false);
  const [isPlaying, setPlaying] = React.useState(false);
  const [isMuted, setMuted] = React.useState(false);
  const [isRecording, setRecording] = React.useState(false);
  const [isPlayback, setPlayback] = React.useState(false);
  const [openCancelDialog, setOpenCancelDialog] = React.useState(false);
  /** @type {[Section, Dispatch<Section>]} */
  const [activeSection, setActiveSection] = React.useState(null);
  /** @type {React.LegacyRef<MicRecorder>} */
  const micRecorder = React.useRef(null);
  /** @type {React.LegacyRef<HTMLAudioElement>} */
  const backgroundAudio = React.useRef(null);
  /** @type {React.LegacyRef<Inferencer>} */
  const inference = React.useRef(null);
  /**
   * Key: sectionId, Value: audio recording
   * @type {[Record<string, HTMLAudioElement>, Dispatch<Record<string, HTMLAudioElement>>]}
   * */
  const [recordings, setRecordings] = React.useState({});
  const recordingsRef = React.useRef(null);
  /**
   * Key: sectionId, Value: audio blob
   * @type {[Record<string, HTMLAudioElement>, Dispatch<Record<string, Blob>>]}
   * */
  const [recordingBlobs, setRecordingBlobs] = React.useState({});
  /**
   * Key: sectionId, Value: transcript
   * @type {[Record<string, string>, Dispatch<Record<string, string>>]}
   * */
  const [transcripts, setTranscripts] = React.useState({});

  const appInsights = useAppInsightsContext();

  /** @type {RefObject<ReactPlayer>} */
  const playerRef = React.useRef();

  const activeSectionRef = React.useRef(activeSection);

  const sectionCardRefs = React.useRef(episode.sections.map(React.createRef));

  const classes = useStyles({
    playerHeight: playerRef.current?.getInternalPlayer()?.offsetHeight,
  });

  useEffect(() => {
    fetchShadows(activeRoom.id);
    appInsights.trackPageView({
      name: 'ShadowPlayer',
    });
  }, [activeRoom]);

  useEffect(() => {
    handleStartup();
  }, [episode, activeRoom, activeMicrophoneId]);

  useEffect(() => {
    return () => {
      stopServices();
      micRecorder.current.dispose();
      inference.current.dispose();
      Object.values(recordingsRef.current).forEach(recording => {
        URL.revokeObjectURL(recording.src);
      });
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const prevRecordings = {};
    const prevTranscripts = {};
    for (const shadow of shadows) {
      prevRecordings[shadow.sectionId] = new Audio(shadow.recordedUrl);
      prevTranscripts[shadow.sectionId] = shadow.inferenceText;
    }
    setRecordings(prevRecordings);
    recordingsRef.current = prevRecordings;
    setTranscripts(prevTranscripts);

    activeSectionRef.current = episode.sections[shadows.length];
    setActiveSection(episode.sections[shadows.length]);

    sectionCardRefs.current[shadows.length].current.scrollIntoView({ behavior: 'smooth' });
  }, [shadows, isReady]);

  useEffect(() => {
    micRecorder.current?.setContextVariables(activeSection, recordings, recordingBlobs);
  }, [micRecorder, activeSection, recordings, recordingBlobs]);

  const history = useHistory();

  if (!activeRoom) {
    history.push(`/episode/${episode.urlTitle}`);
    return;
  }

  const isLoading = shadowsLoading || !isReady;

  const handleStartup = async () => {
    const recorder = new MicRecorder({
      microphoneId: activeMicrophoneId,
      onStop: handleRecorderStop,
    });

    const inferencer = new Inferencer({
      sections: episode.sections,
      lang: Language.ENGLISH,
      onResult: handleInferenceResult,
    });

    const bgAudio = new Audio(episode.backgroundUrl);

    micRecorder.current = recorder;
    inference.current = inferencer;
    backgroundAudio.current = bgAudio;
  };

  const handleRecorderStop = async (newRecordings, newBlobs) => {
    setRecordings(newRecordings);
    recordingsRef.current = newRecordings;
    setRecordingBlobs(newBlobs);
  };

  const handleInferenceResult = (transcript) => {
    setTranscripts(transcripts => ({
      ...transcripts,
      [activeSectionRef.current.id]: transcript,
    }));
  };

  const handleReadyVideo = () => {
    setReady(true);
  };

  const handlePlayerProgress = ({ playedSeconds }) => {
    const passedSectionEnd = playedSeconds >= activeSection?.end;
    const passedEpisodeEnd = playedSeconds >= playerRef.current.getDuration() - 0.05;
    const isRecordingOver = !isPlayback && (passedSectionEnd || passedEpisodeEnd);
    const isPlaybackOver = isPlayback && passedEpisodeEnd;
    if (isRecordingOver || isPlaybackOver) {
      handleStopSection();
    }
  };

  const handlePlaySection = async () => {
    playerRef.current.seekTo(activeSection.start, 'seconds');
    await startServices();
  };

  const handleStopSection = async () => {
    await stopServices();
    if (activeSection) {
      playerRef.current.seekTo(activeSection.start, 'seconds');
    }
  };

  const startServices = async () => {
    // TODO: When page is loaded directly, audio context for mic recorder needs to be initialized by user interaction.
    setMuted(true);
    await micRecorder.current.start();
    inference.current.start();
    setRecording(true);
    setPlaying(true);
  };

  const stopServices = async () => {
    setPlaying(false);
    backgroundAudio.current.pause();
    inference.current.stop();
    micRecorder.current.stop();
    setMuted(false);
    setRecording(false);
  };

  const handlePlayPreview = () => {
    playerRef.current.seekTo(activeSection.start, 'seconds');
    setPlaying(true);
  };

  const handlePlayReplay = () => {
    backgroundAudio.current.currentTime = activeSection.start;
    playerRef.current.seekTo(activeSection.start, 'seconds');
    setMuted(true);
    setPlaying(true);
    micRecorder.current.audio.play();
    backgroundAudio.current.play();
  };

  const handleAcceptSection = async () => {
    const currentIndex = episode.sections.indexOf(activeSection);

    const shadowModel = {
      roomId: activeRoom.id,
      sectionId: activeSection.id,
      inferenceText: transcripts[activeSection.id],
      recording: recordingBlobs[activeSection.id],
    };

    const result = await createShadow(shadowModel);

    if (result.payload instanceof Error) {
      // TODO: Handle error.
      return;
    }

    if (currentIndex < episode.sections.length - 1) {
      activeSectionRef.current = episode.sections[currentIndex+1];
      setActiveSection(episode.sections[currentIndex+1]);
    } else {
      replayAll();
    }
  };

  const replayAll = () => {
    setPlayback(true);
    playerRef.current.seekTo(0);
    backgroundAudio.current.currentTime = 0;
    setActiveSection(null);
    activeSectionRef.current = null;

    for (let section of episode.sections) {
      setTimeout(() => {
        recordings[section.id].play();
      }, section.start * 1000);
    }

    setMuted(true);
    setPlaying(true);
    backgroundAudio.current.play();
  };

  const handleClickBack = () => {
    history.push(`/episode/${episode.urlTitle}`);
  };

  const handleClickCancel = () => {
    setOpenCancelDialog(true);
  };

  const handleCancelCancel = () => {
    setOpenCancelDialog(false);
  };

  const handleConfirmCancel = async () => {
    setOpenCancelDialog(false);
    const result = await cancelRoom(activeRoom.id);
    if (result.payload instanceof Error) return;
    history.push(`/episode/${episode.urlTitle}`);
  };

  return (
    <React.Fragment>
      <ReactPlayer
        ref={playerRef}
        url={episode.videoUrl}
        playing={isPlaying}
        muted={isMuted}
        onReady={handleReadyVideo}
        className={classes.player}
        progressInterval={50}
        onProgress={handlePlayerProgress}
      />

      <Container className={classes.container}>
        <Typography variant="h5" gutterBottom>
          {episode.title}
        </Typography>

        <Box className={classes.sections}>
          {episode.sections.map((section, index) =>
            !isReady ? (
              <Skeleton
                key={section.id}
                variant="rect"
                className={classes.sectionSkeleton}
              />
            ) : (
              <SectionCard
                ref={sectionCardRefs.current[index]}
                key={section.id}
                index={index}
                total={episode.sections.length}
                section={section}
                isActive={section === activeSection}
                isRecording={isRecording}
                transcript={transcripts[section.id]}
                micStream={micRecorder.current?.micStream}
                loading={isLoading}
                onPreview={handlePlayPreview}
                onPlay={handlePlaySection}
                onReplay={handlePlayReplay}
                onAccept={handleAcceptSection}
              />
            )
          )}
        </Box>

        <SpeedDial onBack={handleClickBack} onCancel={handleClickCancel} />

        <ConfirmDialog
          title="Cancel Room"
          open={openCancelDialog}
          text="Are you sure you want to cancel this Shadow Room?"
          onConfirm={handleConfirmCancel}
          onCancel={handleCancelCancel}
        />
      </Container>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(ShadowPlayer));
