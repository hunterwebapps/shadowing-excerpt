# Shadowing Chinese Client

## Setup Instructions

Install `mkcert`

Run `mkcert -install`

Run `mkcert localhost`

## Known Issues

Finding proper chop points for sections. Using subtitles produces empty spots and no room for buffer before/after speech.

* Maybe this is acceptable. Give UI feedback so the user is queued when to start speaking. Will make speech easier to sync up and give feedback about too fast/slow.
* Subtitles need to be properly aligned with speech. Be careful not to chop off audio.

Proper nouns like "Frieza" are difficult to return valid speech recognition.

* If it's capital, give it a little juice via the GrammarList.
