import React, {useEffect, useState} from 'react';
import {useChatContext} from '../context/ChatContext';
import Markdown from 'react-markdown';
import styles from './styles/ResultDisplay.module.css';
import { JsonParser } from '../jsonparse';

const ResultDisplay: React.FC = () => {
	const {response} = useChatContext();
	const[parsedJson, setParsedJson] = useState(null);

	useEffect(() => {
		if (!response) { return; }
		setParsedJson(JsonParser.parseIncompleteJson(response) as any);
	}, [response]);

	if (response) {
			return (
				<>
				<div>
					Tags:
					<div>
						<p>{JSON.stringify(parsedJson?.etiquetas)}</p>
					</div>
					<div>
						traducción:
						<Markdown>{((parsedJson?.traducción || '') as string).replace(/\\n/g, '\n\n')}</Markdown>
					</div>
					</div>
				</>
			)
	}

	return null;
};

export default ResultDisplay;
