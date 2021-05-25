export class SubtitlesCollection {
  static validTypes = ['WEBVTT'];

  /** @type {Subtitles[]} */
  subtitles = [];

  /** @type {string} */
  file = null;

  /** @param {string} subtitlesFile */
  constructor(subtitlesFile) {
    this.file = subtitlesFile;

    const sections = this.file.split(/\r?\n\r?\n/);

    this.type = sections.shift().trim();

    if (!SubtitlesCollection.validTypes.includes(this.type)) {
      throw new Error(`Invalid type: ${this.type}`);
    }

    while (sections.length > 0) {
      const [timestamp, text] = sections.shift().split(/\r?\n/);
      const sub = new Subtitles(timestamp.trim(), text.trim());
      this.subtitles.push(sub);
    }
  }

  sliceSubtitles(start, end) {
    return this.subtitles
      .filter((s) =>
        (s.start <= start && s.end >= start) ||
        (s.start >= start && s.end <= end) ||
        (s.start <= end && s.end >= end)
      );
  }
}

export class Subtitles {
  /**
   * @param {string} timestamp
   * @param {string} text
   **/
  constructor(timestamp, text) {
    const [start, end] = timestamp.split(' --> ');

    this.start = new Date(`1970-01-01T${start}Z`).getTime() / 1000;
    this.end = new Date(`1970-01-01T${end}Z`).getTime() / 1000;

    this.text = text;
  }
}
