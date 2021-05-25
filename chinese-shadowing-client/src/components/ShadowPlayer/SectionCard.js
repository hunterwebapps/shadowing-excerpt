import React from 'react';
import { bool, string, func, number, instanceOf } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Section from '@models/Section';
import { MatchedWordCollection } from './sectionMatches';
import { MicStream } from './micStream';

import {
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from '@material-ui/core';
import {
  Replay as ReplayIcon,
  CheckCircle as CheckCircleIcon,
  Mic as MicIcon,
  Stop as StopIcon,
} from '@material-ui/icons';
import WaveVisualizer from './WaveVisualizer';
import Button from '@controls/Button';

const useStyles = makeStyles(theme => ({
  section: props => ({
    backgroundColor: props.isActive
      ? theme.palette.action.selected
      : theme.palette.background.paper,
  }),
  sectionWrapper: {
    paddingTop: '1rem',
  },
  sectionCount: {
    float: 'right',
    top: '-0.5rem',
    right: '-0.3rem',
    position: 'relative',
  },
  actions: {
    justifyContent: 'space-between',
  },
  micIcon: props => {
    const backgroundColor = props.isRecording
      ? theme.palette.error.main
      : theme.palette.primary.main;
    return {
      margin: '0 auto',
      backgroundColor,
      padding: '1rem',
      color: theme.palette.getContrastText(backgroundColor),
    };
  },
}));

/**
 * @param {{
 *  section: Section,
 *  transcript: string,
 *  micStream: MicStream,
 * }} props
 */
function SectionCard({
  section,
  transcript,
  isActive,
  isRecording,
  index,
  total,
  micStream,
  loading,
  onPreview,
  onPlay,
  onReplay,
  onAccept,
}, ref) {
  /** @type {[MatchedWordCollection, React.Dispatch<MatchedWordCollection>]} */
  const [matchedWords, setMatchedWords] = React.useState(
    () => new MatchedWordCollection(section.text, transcript)
  );

  const classes = useStyles({ isActive, isRecording });

  React.useEffect(() => {
    setMatchedWords(new MatchedWordCollection(section.text, transcript));
  }, [isActive, section, transcript]);

  const handleClickPreview = () => {
    if (!isActive) return;
    onPreview();
  };

  const handleClickPlay = () => {
    onPlay();
  };

  const handleClickReplay = () => {
    onReplay();
  };

  const handleClickAccept = () => {
    onAccept();
  };

  const isSuccess = matchedWords.result?.every((r) => r.matched);

  const itemNumber = `${index+1}/${total}`;

  return (
    <div ref={ref} className={classes.sectionWrapper}>
      <Card key={section.id} className={classes.section}>
        <CardContent onClick={handleClickPreview}>
          <Typography variant="caption" className={classes.sectionCount}>
            {itemNumber}
          </Typography>
          <Typography variant="h6">
            {matchedWords.result
              ? matchedWords.result.map((r) => (
                <span
                  key={r.strippedWord}
                  className={`font-bold ${(r.matched ? 'txt-green' : 'txt-red')}`}
                  style={{ display: 'inline-block' }}
                >
                  {r.originalWord}&nbsp;
                </span>
              ))
              : section.text
            }
          </Typography>
          {isActive && (
            <WaveVisualizer micStream={micStream} />
          )}
        </CardContent>
        {isActive && (
          <CardActions disableSpacing className={classes.actions}>
            {transcript && (
              <IconButton onClick={handleClickReplay}>
                <ReplayIcon />
              </IconButton>
            )}
            <Button loading={loading} icon onClick={handleClickPlay} className={classes.micIcon}>
              {isRecording
                ? <StopIcon />
                : <MicIcon />
              }
            </Button>
            {isSuccess && (
              <IconButton onClick={handleClickAccept}>
                <CheckCircleIcon />
              </IconButton>
            )}
          </CardActions>
        )}
      </Card>
    </div>
  );
}

const SectionCardForwardRef = React.forwardRef(SectionCard);

SectionCardForwardRef.propTypes = {
  section: instanceOf(Section).isRequired,
  transcript: string,
  isActive: bool.isRequired,
  index: number.isRequired,
  total: number.isRequired,
  micStream: instanceOf(MicStream),
  loading: bool.isRequired,
  onPreview: func.isRequired,
  onPlay: func.isRequired,
  onReplay: func.isRequired,
  onAccept: func.isRequired,
};

export default React.memo(SectionCardForwardRef);
