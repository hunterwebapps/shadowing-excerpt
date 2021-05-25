import voiceActivityDetection from 'voice-activity-detection';
// eslint-disable-next-line
import { MicRecorder } from './micRecorder';

export class SpeechTimer {
  /** @type {AudioContext} */
  #context = null;
  /** @type {MicRecorder} */
  #recorder = null;

  #vad = null;

  startTime = null;

  /**
   * Listen to a mic recorder for speech start time.
   * @param {{ recorder: MicRecorder }} props
   */
  constructor({ recorder }) {
    this.#recorder = recorder;
  }

  async start() {
    this.#context = new AudioContext();
    const stream = await this.#recorder.micStream.getStream()
    this.#vad = voiceActivityDetection(this.#context, stream, {
      onVoiceStart: () => {
        const lag = 500;
        this.startTime = (Date.now() - this.#recorder.startTime - lag) / 1000;
        console.log('Speech Start Time', this.startTime);
      },
    });
  }

  async stop() {
    if (this.#context?.state === 'running') {
      await this.#context.close();
      this.#vad.destroy();
    }
  }
}
