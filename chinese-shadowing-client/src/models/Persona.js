// eslint-disable-next-line
import Gender from './enums/Gender';

export default class Persona {
  /** @type {string} */
  id;
  /** @type {string} */
  name;
  /** @type {Gender} */
  gender;

  constructor(persona) {
    // TODO: Remove after persona created.
    if (!persona) return;
    this.id = persona.id;
    this.name = persona.name;
    this.gender = persona.gender;
  }
}
