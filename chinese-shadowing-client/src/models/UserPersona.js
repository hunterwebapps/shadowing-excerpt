export default class UserPersona {
  /** @type {string} */
  id;
  /** @type {string} */
  userId;
  /** @type {string} */
  personaId;

  constructor(userPersona) {
    this.id = userPersona.id;
    this.userId = userPersona.userId;
    this.personaId = userPersona.personaId;
  }
}
