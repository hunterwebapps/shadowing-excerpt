// eslint-disable-next-line
import Section from '../Section';

/** @enum {string} */
export const Difficulty = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

class Episode {
  /** @type {string} */
  id;
  /** @type {string} */
  urlTitle;
  /** @type {object[]} */
  sections;

  /**
   * @param {string} title
   * @param {number} thumbnail
   * @param {[number, number]} range
   * @param {Difficulty} difficulty
   * @param {Section[]} sections
   **/
  constructor(title, thumbnail, range = [], difficulty, sections) {
    this.title = title;
    this.thumbnail = thumbnail;
    this.start = range[0];
    this.end = range[1];
    this.difficulty = difficulty;
    this.sections = sections;
  }
}

export default Episode;
