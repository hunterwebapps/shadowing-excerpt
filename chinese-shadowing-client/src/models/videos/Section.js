class Section {
  /** @type {Date} */
  start;
  /** @type {Date} */
  end;
  /** @type {string} */
  text;
  /** @type {string} */
  personaId;

  constructor(section) {
    this.start = section.start;
    this.end = section.end;
    this.text = section.text;
    this.personaId = section.personaId;
  }
}

export default Section;
