export class MicStream {
  /** @type {MediaStream} */
  #rawStream;

  constructor(deviceId) {
    this.deviceId = deviceId;
  }

  async getStream() {
    if (this.#rawStream?.active) {
      return this.#rawStream;
    }

    this.#rawStream = await navigator
      .mediaDevices
      .getUserMedia({
        audio: {
          deviceId: this.deviceId,
        },
      });

    this.#rawStream.getTracks().forEach(track => {
      track.applyConstraints({
        sampleRate: 48000,
        channelCount: 1,
      });
    })

    return this.#rawStream;
  }

  dispose() {
    this.#rawStream
      .getTracks()
      .forEach(track => {
        track.stop();
      });
  }
}
