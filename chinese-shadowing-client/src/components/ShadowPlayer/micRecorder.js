/// <reference types="@types/dom-mediacapture-record" />
import { MicStream } from './micStream';

export class MicRecorder {
  /** @type {MediaRecorder} */
  #recorder = null;
  /** @type {Blob} */
  #recording;

  /** @type {number} */
  startTime = null;
  /** @type {MicStream} */
  micStream = null;
  /** @type {HTMLAudioElement} */
  audio = null;

  /**
   * @param {{
   *  micStream: MicStream,
   *  onInput: Function,
   *  onStop: Function,
   * }} params */
  constructor({ microphoneId, onStop }) {
    this.micStream = new MicStream(microphoneId);
    this.onStop = onStop;

    this._handleStart = this._handleStart.bind(this);
    this._handleDataAvailable = this._handleDataAvailable.bind(this);
    this._handleStop = this._handleStop.bind(this);
  }

  async start() {
    if (!this.#recorder?.stream.active) {
      await this._initializeRecorder();
    }

    if (this.#recorder.state !== 'recording') {
      this.#recorder.start();
    }
  }

  stop() {
    if (this.#recorder?.state === 'recording') {
      this.#recorder.stop();
    }
  }

  setContextVariables(activeSection, recordings, blobs) {
    this.activeSection = activeSection;
    this.recordings = recordings;
    this.blobs = blobs;
  }

  dispose() {
    this.micStream.dispose();
    if (!this.#recorder) return;
    this.#recorder.removeEventListener('start', this._handleStart);
    this.#recorder.removeEventListener('dataavailable', this._handleDataAvailable);
    this.#recorder.removeEventListener('stop', this._handleStop);
  }

  async _initializeRecorder() {
    const stream = await this.micStream.getStream();

    this.#recorder = new MediaRecorder(stream);

    this.#recorder.addEventListener('start', this._handleStart);
    this.#recorder.addEventListener('dataavailable', this._handleDataAvailable);
    this.#recorder.addEventListener('stop', this._handleStop);
  }

  _handleStart() {
    this.startTime = Date.now();
  }

  _handleDataAvailable(e) {
    this.#recording = e.data;
  }

  _handleStop() {
    if (this.activeSection === null) return;
    const url = URL.createObjectURL(this.#recording);
    this.audio = new Audio(url);
    this.recordings[this.activeSection.id] = this.audio;
    this.blobs[this.activeSection.id] = this.#recording;
    this.onStop(this.recordings, this.blobs);
  }
}
