import Episode from './Episode';

export default class Series {
  /** @type {string} */
  id;
  /** @type {string} */
  title;
  /** @type {string} */
  urlTitle;
  /** @type {Episode[]} */
  episodes;

  constructor (series) {
    this.id = series.id;
    this.title = series.title;
    this.urlTitle = series.urlTitle;
    this.episodes = series.episodes.map(e => new Episode(e));
  }
}
