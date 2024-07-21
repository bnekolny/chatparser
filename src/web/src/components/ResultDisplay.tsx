import React, {useEffect, useState} from 'react';
import {useChatContext} from '../context/ChatContext';
import {parseMarkdown} from '../utils';
import {Feedback} from '../types';

const ResultDisplay: React.FC = () => {
	const {response} = useChatContext();
	const [parsedMarkdown, setParsedMarkdown] = useState<Feedback | null>(null);

	useEffect(() => {
		if (response) {
			const parsed = parseMarkdown(response);
			setParsedMarkdown(parsed);
		}
	}, [response]);
	// TODO: take into consideration how improve options is returned
	if (response && parsedMarkdown) {
		return (
			<div className="response">
				<h2>{parsedMarkdown.title}</h2>
				<div className="responseContent">
					{parsedMarkdown.sections.map((section, index) => (
						<div key={index}>
							<h3>{section.title}</h3>
							<p>{section.content}</p>
						</div>
					))}
				</div>
			</div>
		);
	}

	return null;
};

export default ResultDisplay;
