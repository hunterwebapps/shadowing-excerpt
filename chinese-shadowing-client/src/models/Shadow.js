export default class Shadow {
  /** @type {string} */
  id;
  /** @type {string} */
  sectionId;
  /** @type {string} */
  recordedUrl;
  /** @type {string} */
  inferenceText;

  constructor(shadow) {
    this.id = shadow.id;
    this.sectionId = shadow.sectionId;
    this.recordedUrl = shadow.recordedUrl;
    this.inferenceText = shadow.inferenceText;
  }
}
