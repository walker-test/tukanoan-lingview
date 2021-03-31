import id from 'shortid';
import { Sentence } from "./Sentence.jsx";
import { TextFormatButton } from './TextFormatButton.jsx';

function UntimedBlock({ sentence, sentenceId, metadata }) {
	return (
		<div className="untimedBlock">
			<div className="timeStampAndButtonContainer">
				<span className="timeStampContainer timeStamp" data-sentence_id={sentenceId}>
					{sentenceId}
				</span>
				<TextFormatButton sentence={sentence} metadata={metadata}/>
			</div>
			<Sentence sentence={sentence} />
		</div>
	);
}

export function UntimedTextDisplay({ sentences, metadata }) {
	// I/P: sentences, a list of sentences
	// O/P: the main gloss view, with several Sentences arranged vertically, each wrapped in an UntimedBlock
	// Status: tested, working
	let output = [];
	let sentenceCount = 1;
	for (const sentence of sentences) {
		output.push(
			<UntimedBlock
				key={id.generate()}
				sentence={sentence}
				sentenceId={sentenceCount}
				metadata={metadata}
			/>
		);
		sentenceCount += 1;
	}
	return <div id="untimedTextDisplay">{output}</div>;
}
