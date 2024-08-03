import React, {useEffect, useState} from 'react';
import {useChatContext} from '../context/ChatContext';
import Markdown from 'react-markdown';
import styles from './styles/ResultDisplay.module.css';
import { JsonParser } from '../jsonparse';

const ResultDisplay: React.FC = () => {
	const {response} = useChatContext();
	const[parsedJson, setParsedJson] = useState(null);

	useEffect(() => {
		//setParsedJson(JsonParser.parseIncompleteJson(response) as any);
		setParsedJson(JsonParser.parseIncompleteJson(
			'{"etiquetas": ["solicitud de cita", "flexibilidad", "horario"], "traducción": "👋 Hi! I think wer'));
	}, [response]);

	if (response) {
			return (
				<>
					Tags:
					<div className={styles.markdownContainer}>
						<p>{JSON.stringify(parsedJson?.etiquetas)}</p>
					</div>
					<div className={styles.markdownContainer}>
						traducción:
						<p>{parsedJson?.traducción}</p>
					</div>
				</>
			)
	}

	return null;
};

export default ResultDisplay;
