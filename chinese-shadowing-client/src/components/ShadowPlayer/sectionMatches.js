export class MatchedWordCollection {
  /**
   * @param {string} text
   * @param {string} transcript
   */
  constructor(text, transcript, lang = 'en-US') {
    this.originalText = text;
    this.originalTranscript = transcript;

    this.transformDetails = this.getTransformDetails(lang);

    this.sectionWords = this.getMatchedWords(text);
    this.transcriptWords = this.getMatchedWords(transcript);
  }

  getTransformDetails(lang) {
    switch (lang) {
      case 'en-US':
        return {
          replace: /[^a-z0-9\s]/ig,
          split: ' ',
        };
      case 'cmn-Hans-CN':
        return {
          replace: /[^\p{Han}]/g,
          split: '',
        };
      default:
        throw new Error('Invalid lang provided.');
    }
  }

  /** @param {string} text */
  getMatchedWords(text) {
    // TODO: Handle chinese punctuation properly.
    const originalWords = text?.split(this.transformDetails.split);
    const matchedWords = text
      ?.replace(this.transformDetails.replace, '')
      .split(this.transformDetails.split)
      .map((strippedWord, position) =>
        new MatchedWord(
          originalWords[position],
          strippedWord.toLowerCase(),
          position
        )
      );

    return matchedWords;
  }

  get result() {
    if (!this.originalTranscript) {
      return null;
    }

    const results = [];
    const sectionWords = [...this.sectionWords];
    const transcriptWords = [...this.transcriptWords];

    while (sectionWords.length > 0) {
      const sectionWord = sectionWords.shift();
      for (let i = 0; i < transcriptWords.length; i++) {
        if (sectionWord.strippedWord === transcriptWords[i].strippedWord) {
          transcriptWords.splice(0, i+1);
          sectionWord.matched = true;
          break;
        }
      }
      results.push(sectionWord);
    }

    return results;
  }
}

export class MatchedWord {
  /**
   * @param {string} originalWord
   * @param {string} strippedWord
   * @param {number} position
   */
  constructor(originalWord, strippedWord, position) {
    this.originalWord = originalWord;
    this.strippedWord = strippedWord;
    this.position = position;
    this.matched = false;
  }
}
