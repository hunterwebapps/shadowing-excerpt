import DynamicTimeWarping from 'dynamic-time-warping';

export default class AudioWarping {
  /** @type {Uint8Array} */
  warped;

  /**
   * @param {Uint8Array} original
   * @param {Uint8Array} recoreded
   */
  constructor(original, recorded) {
    const path = [];

    const totalPieces = 100;
    const originalChunkSize = Math.ceil(original.length / totalPieces);
    const recordedChunkSize = Math.ceil(recorded.length / totalPieces);
    for (let i = 0; i < totalPieces; i++) {
      const originalOffset = i * originalChunkSize;
      const originalTake = originalOffset + originalChunkSize;
      const originalChunk = original.slice(originalOffset, originalTake);

      const recordedOffset = i * recordedChunkSize;
      const recordedTake = recordedOffset + recordedChunkSize;
      const recordedChunk = recorded.slice(recordedOffset, recordedTake);

      const dtw = new DynamicTimeWarping(originalChunk, recordedChunk, this._calcDistance);
      const pathChunk = dtw.getPath();
      path.push(...pathChunk);
    }

    this.warped = new Uint8Array(path.length);
    for (let i = 0; i < path.length; i++) {
      const step = path[i][0];
      this.warped[i] = recorded[step];
    }
  }

  _calcDistance(original, recorded) {
    return Math.abs(original - recorded);
  }

  // async getWarped() {
  //   const context = new AudioContext();
  //   const source = context.createBufferSource();
  //   const buffer = await context.decodeAudioData(this.#warped.buffer);
  //   source.buffer = buffer;
  //   source.connect(context.destination);
  //   source.start();
  // }
}
