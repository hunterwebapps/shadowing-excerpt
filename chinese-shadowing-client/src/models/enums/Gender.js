/** @enum {string} */
const Gender = {
  UNSPECIFIED: 'Unspecified',
  MALE: 'Male',
  FEMALE: 'Female',

  /** @returns {string[]} */
  toArray() {
    return [this.UNSPECIFIED, this.MALE, this.FEMALE];
  },
};

export default Gender;
