import React from 'react';
import { connect } from 'react-redux';
import { instanceOf } from 'prop-types';
import { MicStream } from './micStream';
import { makeStyles } from '@material-ui/core/styles';
import { selectThemeType } from '@/store/modules/theme';

WaveVisualizer.propTypes = {
  micStream: instanceOf(MicStream),
};

const useStyles = makeStyles({
  waveCanvas: {
    width: '100%',
    height: '5rem',
    marginTop: '1rem',
  },
});

const mapStateToProps = state => ({
  theme: selectThemeType(state),
});

/** @param {{ micStream: MicStream }} props */
function WaveVisualizer({ theme, micStream }) {
  const classes = useStyles();

  React.useEffect(() => {
    if (!micStream) return;
    visualizeRecordingStream();
    // eslint-disable-next-line
  }, [micStream]);

  /** @type {React.LegacyRef<HTMLCanvasElement>} */
  const canvasRef = React.useRef();

  const visualizeRecordingStream = async () => {
    const audioContext = new AudioContext();
    const stream = await micStream.getStream();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const canvasContext = canvasRef.current.getContext("2d");

    draw(analyser, dataArray, canvasContext);
  };

  const draw = (analyser, dataArray, canvasContext) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    requestAnimationFrame(() => draw(analyser, dataArray, canvasContext));

    analyser.getByteTimeDomainData(dataArray);

    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
    canvasContext.fillStyle = 'rgba(0, 0, 0, 0)';
    canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = theme === 'dark'
      ? 'rgb(255, 255, 255, 1)'
      : 'rgb(0, 0, 0, 1)';

    canvasContext.beginPath();

    const bufferLength = analyser.frequencyBinCount;

    const sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * HEIGHT / 2;

      if (i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasContext.lineTo(canvas.width, canvas.height / 2);
    canvasContext.stroke();
  };

  return (
    <canvas ref={canvasRef} className={classes.waveCanvas} />
  );
}

export default connect(mapStateToProps, {})(WaveVisualizer);
