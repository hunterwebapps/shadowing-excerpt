// eslint-disable-next-line
import Section from '@/models/videos/Section';

const {
  SpeechRecognition,
  webkitSpeechRecognition,
  SpeechGrammarList,
  webkitSpeechGrammarList,
} = window;

/** @enum {string} */
export const Language = {
  ENGLISH: 'en-US',
  CHINESE: 'cmn-Hans-CN',
};

export class Inferencer {
  /** @type {SpeechRecognition} */
  #speechRecognition;
  /** @type {SpeechGrammarList} */
  #grammarList;
  /** @type {Language} */
  #language;

  #started = false;

  /**
   * @param {{
   *  sections: Section[],
   *  onResult: Function,
   *  lang: Language,
   * }} props */
  constructor({ sections, onResult, lang = Language.CHINESE }) {
    this.onResult = onResult;
    this.#language = lang;
    this.#speechRecognition = new (SpeechRecognition || webkitSpeechRecognition)();
    this.#grammarList = new (SpeechGrammarList || webkitSpeechGrammarList)();

    if (this.#language === Language.ENGLISH) {
      // Add weight to capitalized words (only way to identify proper nouns) because they're hard for speech recognition.
      sections
        .flatMap((section) => section.text.split(' '))
        .filter((word) => word[0] === word[0].toUpperCase())
        .forEach((word) => {
          this.#grammarList.addFromString(word.replace(/[^A-Za-z]/g, ''), 20);
        });
    }

    this._handleSpeechStart = this._handleSpeechStart.bind(this);
    this._handleSpeechEnd = this._handleSpeechEnd.bind(this);
    this._handleResult = this._handleResult.bind(this);
    this._handleNoMatch = this._handleNoMatch.bind(this);
    this._handleError = this._handleError.bind(this);

    this._initialize();
  }

  start() {
    if (!this.#started) {
      this.#speechRecognition.start();
      this.#started = true;
    }
  }

  stop() {
    if (this.#started) {
      this.#speechRecognition.stop();
      this.#started = false;
    }
  }

  dispose() {
    if (this.#started) {
      this.#speechRecognition.abort();
    }
    this.#speechRecognition.removeEventListener('speechstart', this._handleSpeechStart);
    this.#speechRecognition.removeEventListener('speechend', this._handleSpeechEnd);
    this.#speechRecognition.removeEventListener('result', this._handleResult);
    this.#speechRecognition.removeEventListener('nomatch', this._handleNoMatch);
    this.#speechRecognition.removeEventListener('error', this._handleError);
  }

  _initialize() {
    this.#speechRecognition.grammars = this.#grammarList;
    this.#speechRecognition.lang = this.#language;
    this.#speechRecognition.continuous = true;
    this.#speechRecognition.interimResults = false;
    this.#speechRecognition.maxAlternatives = 1;

    this.#speechRecognition.addEventListener('speechstart', this._handleSpeechStart);
    this.#speechRecognition.addEventListener('speechend', this._handleSpeechEnd);
    this.#speechRecognition.addEventListener('result', this._handleResult);
    this.#speechRecognition.addEventListener('nomatch', this._handleNoMatch);
    this.#speechRecognition.addEventListener('error', this._handleError);
  }

  _handleSpeechStart(e) {}

  _handleSpeechEnd(e) {}

  /** @param {SpeechRecognitionEvent} e */
  _handleResult(e) {
    const { transcript, confidence } = e.results[0][0];
    this.onResult(transcript);
    console.log('Transcript', transcript, confidence);
  }

  _handleNoMatch(e) {
    console.log('No match', e);
  }

  _handleError(e) {
    this.#started = false;
    console.log('Error', e);
  }
}
