import Shadow from './Shadow';
import UserPersona from './UserPersona';

/** @enum {string} */
export const RoomState = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export default class Room {
  /** @type {string} */
  id;
  /** @type {string} */
  episodeId;
  /** @type {UserPersona[]} */
  userPersonas;
  /** @type {Shadow[]} */
  shadows;
  /** @type {RoomState} */
  state;

  constructor(room) {
    this.id = room.id;
    this.episodeId = room.episodeId;
    this.userPersonas = room.userPersonas.map(x => new UserPersona(x));
    this.shadows = room.shadows.map(x => new Shadow(x));
    this.state = room.state;
  }
}
