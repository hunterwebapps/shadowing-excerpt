import Persona from './Persona';

export default class Section {
  /** @type {string} */
  id;
  /** @type {number} */
  start;
  /** @type {number} */
  end;
  /** @type {string} */
  audioUrl;
  /** @type {string} */
  text;
  /** @type {Persona} */
  persona;

  constructor(section) {
    this.id = section.id;
    this.start = section.start;
    this.end = section.end;
    this.audioUrl = section.audioUrl;
    this.text = section.text;
    this.persona = new Persona(section.persona);
  }
}
