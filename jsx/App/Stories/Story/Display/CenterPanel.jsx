import { UntimedTextDisplay } from './Untimed.jsx';
import { TimedTextDisplay } from './Timed.jsx';

export function CenterPanel({ timed, sentences }) {
	// I/P: timed, a boolean value
	//      sentences, a list of sentences
	// O/P: the main panel showing glossing, timestamps, etc.
	// Status: tested, working

	// TODO for text formatter:
	// print out sentences here to see if metadata is included (probably not)
	// if not, need to get it from Story.jsx
	if (timed) {
		return <div id="centerPanel"><TimedTextDisplay sentences={sentences} /></div>;
	} else {
		return <div id="centerPanel"><UntimedTextDisplay sentences={sentences} /></div>;
	}
}
