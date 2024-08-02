import React, { useEffect, useState } from 'react';
import {useChatContext} from '../context/ChatContext';
import {Mode} from '../types';

const TestTextButton: React.FC = () => {
	const {setText, setMode, handleSendMessage} = useChatContext();
	const [testString, setTestString] = useState('');

	useEffect(() => {
		fetch('/assets/samples/message_verification_appointment.txt')
		.then((response) => response.text())
		.then((text) => setTestString(text.trim()));
	}, []);

	const submitTestText = async () => {
		await setText(testString);
		await setMode(Mode.Verify);
		handleSendMessage(testString);
	};

	return (
		<button
			type="button"
			onClick={submitTestText}
			className="button"
			style={{marginTop: '30px'}}
		>
			Submit test text
		</button>
	);
};

export default TestTextButton;
