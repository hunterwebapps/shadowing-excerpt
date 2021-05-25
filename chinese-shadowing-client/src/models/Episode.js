import Section from './Section';

/** @enum {string} */
export const Difficulty = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

export default class Episode {
  /** @type {string} */
  id;
  /** @type {string} */
  title;
  /** @type {string} */
  urlTitle;
  /** @type {number} */
  duration;
  /** @type {Difficulty} */
  difficulty;
  /** @type {string} */
  thumbnailUrl;
  /** @type {string} */
  videoUrl;
  /** @type {string} */
  backgroundUrl;
  /** @type {string} */
  seriesId;
  /** @type {Section[]} */
  sections;

  constructor (episode) {
    this.id = episode.id;
    this.title = episode.title;
    this.urlTitle = episode.urlTitle;
    this.duration = episode.duration;
    this.difficulty = episode.difficulty;
    this.thumbnailUrl = episode.thumbnailUrl;
    this.videoUrl = episode.videoUrl;
    this.backgroundUrl = episode.backgroundUrl;
    this.seriesId = episode.seriesId;
    this.sections = episode.sections.map(s => new Section(s));
  }

  getPersonas() {
    const personaIds = [];
    const personas = this.sections.map(section => section.persona);
    return personas.filter(persona => {
      if (personaIds.includes(persona.id)) return false;
      personaIds.push(persona.id);
      return true;
    });
  }

  get durationTimestamp() {
    return new Date(this.duration * 1000).toISOString().substr(14, 8);
  }
}
