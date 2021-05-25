export default class MicrophoneInfo {
  /** @type {string} */
  deviceId;
  /** @type {string} */
  label;

  constructor({ deviceId, label }) {
    this.deviceId = deviceId;
    this.label = label;
  }
}
